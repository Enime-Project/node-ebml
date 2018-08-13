import { Transform } from 'stream';
import tools from './tools';
import schema from './schema';

const debug = require('debug')('ebml:decoder');

const STATE_TAG = 1;
const STATE_SIZE = 2;
const STATE_CONTENT = 3;

export default class EbmlDecoder extends Transform {
    /**
     * @property
     * @private
     * @type {Buffer}
     */
    mBuffer = null;

    /**
     * @private
     * @property
     * @readonly
     */
    mTagStack = [];

    /**
     * @property
     * @private
     * @type {Number}
     */
    mState = STATE_TAG;

    /**
     * @property
     * @private
     * @type {Number}
     */
    mCursor = 0;

    /**
     * @property
     * @private
     * @type {Number}
     */
    mTotal = 0;

    /**
     * @constructor
     * @param {TransformOptions} options The options to be passed along to the super class
     */
    constructor(options = {}) {
        super({ ...options, readableObjectMode: true });
    }

    get buffer() {
        return this.mBuffer;
    }

    get cursor() {
        return this.mCursor;
    }

    get state() {
        return this.mState;
    }

    get tagStack() {
        return this.mTagStack;
    }

    get total() {
        return this.mTotal;
    }

    set buffer(buffer) {
        if (this.mBuffer !== buffer) {
            this.mBuffer = buffer;
        }
    }

    set cursor(cursor) {
        // cheap copy -- no check needed
        this.mCursor = cursor;
    }

    set state(state) {
        if (this.mState !== state) {
            this.mState = state;
        }
    }

    set total(total) {
        this.mTotal = total;
    }

    _transform(chunk, enc, done) {
        if (!this.buffer) {
            this.buffer = Buffer.from(chunk);
        } else {
            this.buffer = tools.concatenate(this.buffer, Buffer.from(chunk));
        }

        while (this.cursor < this.buffer.length) {
            if (this.state === STATE_TAG && !this.readTag()) {
                break;
            }
            if (this.state === STATE_SIZE && !this.readSize()) {
                break;
            }
            if (this.state === STATE_CONTENT && !this.readContent()) {
                break;
            }
        }

        done();
    }

    static getSchemaInfo(tagStr) {
        return (
            schema[tagStr] || {
                type: 'unknown',
                name: 'unknown'
            }
        );
    }

    readTag() {
        debug('parsing tag');

        if (this.cursor >= this.buffer.length) {
            debug('waiting for more data');

            return false;
        }

        const start = this.total;
        const tag = tools.readVint(this.buffer, this.cursor);

        if (tag == null) {
            debug('waiting for more data');

            return false;
        }

        const tagStr = tools.readHexString(
            this.buffer,
            this.cursor,
            this.cursor + tag.length
        );

        this.cursor += tag.length;
        this.total += tag.length;
        this.state = STATE_SIZE;

        const tagObj = {
            tag: tag.value,
            tagStr,
            type: EbmlDecoder.getSchemaInfo(tagStr).type,
            name: EbmlDecoder.getSchemaInfo(tagStr).name,
            start,
            end: start + tag.length
        };

        this.tagStack.push(tagObj);
        debug(`read tag: ${tagStr}`);

        return true;
    }

    readSize() {
        const tagObj = this.tagStack[this.tagStack.length - 1];

        debug(`parsing size for tag: ${tagObj.tagStr}`);

        if (this.cursor >= this.buffer.length) {
            debug('waiting for more data');

            return false;
        }

        const size = tools.readVint(this.buffer, this.cursor);

        if (size == null) {
            debug('waiting for more data');

            return false;
        }

        this.cursor += size.length;
        this.total += size.length;
        this.state = STATE_CONTENT;
        tagObj.dataSize = size.value;

        // unknown size
        if (size.value === -1) {
            tagObj.end = -1;
        } else {
            tagObj.end += size.value + size.length;
        }

        debug(`read size: ${size.value}`);

        return true;
    }

    readContent() {
        const tagObj = this.tagStack[this.tagStack.length - 1];

        debug(`parsing content for tag: ${tagObj.tagStr}`);

        if (tagObj.type === 'm') {
            debug('content should be tags');
            this.push(['start', tagObj]);
            this.state = STATE_TAG;

            return true;
        }

        if (this.buffer.length < this.cursor + tagObj.dataSize) {
            debug(`got: ${this.buffer.length}`);
            debug(`need: ${this.cursor + tagObj.dataSize}`);
            debug('waiting for more data');

            return false;
        }

        const data = this.buffer.subarray(
            this.cursor,
            this.cursor + tagObj.dataSize
        );
        this.total += tagObj.dataSize;
        this.state = STATE_TAG;
        this.buffer = this.buffer.subarray(this.cursor + tagObj.dataSize);
        this.cursor = 0;

        this.tagStack.pop(); // remove the object from the stack

        this.push(['tag', tools.readDataFromTag(tagObj, Buffer.from(data))]);

        while (this.tagStack.length > 0) {
            const topEle = this.tagStack[this.tagStack.length - 1];
            if (this.total < topEle.end) {
                break;
            }
            this.push(['end', topEle]);
            this.tagStack.pop();
        }

        debug(`read data: ${data.toString('hex')}`);

        return true;
    }
}
