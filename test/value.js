/* eslint-disable no-sync */
/* globals describe, it */

const fs = require('fs');
const ebml = require('../lib/ebml/index.js');
const assert = require('assert');

process.setMaxListeners(Infinity);

describe('embl', function() {
    describe('Values in tags', function() {

        let data = fs.readFileSync('media/video-webm-codecs-avc1-42E01E.webm');

        it('should get a correct PixelWidth value from a video/webm; codecs="avc1.42E01E" file (2-byte unsigned int)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'PixelWidth') {
                    assert.equal(chunk[1].value, 352);
                    done();
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

        it('should get a correct EBMLVersion value from a video/webm; codecs="avc1.42E01E" file (one-byte unsigned int)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'EBMLVersion') {
                    assert.equal(chunk[1].value, 1);
                    done();
                }
                decoder.on('finish', function() {
                    assert.equal(0, 1, 'hit end of file without finding tag.');
                    done();
                });
            });
            decoder.write(data);
        });

        it('should get a correct TimeCodeScale value from a video/webm; codecs="avc1.42E01E" file (3-byte unsigned int)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'TimecodeScale') {
                    assert.equal(chunk[1].value, 1000000);
                    done();
                }
                decoder.on('finish', function() {
                    assert.equal(0, 1, 'hit end of file without finding tag.');
                    done();
                });
            });
            decoder.write(data);
        });

        it('should get a correct TrackUID value from a video/webm; codecs="avc1.42E01E" file (56-bit integer in hex)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'TrackUID') {
                    assert.equal(chunk[1].value, '306d02aaa74d06');
                    done();
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

        it('should get a correct DocType value from a video/webm; codecs="avc1.42E01E" file (ASCII text)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'DocType') {
                    assert.equal(chunk[1].value, 'webm');
                    done();
                }
                decoder.on('finish', function() {
                    assert.equal(0, 1, 'hit end of file without finding tag.');
                    done();
                });
            });
            decoder.write(data);
        });

        it('should get a correct MuxingApp value from a video/webm; codecs="avc1.42E01E" file (utf8 text)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'MuxingApp') {
                    assert.equal(chunk[1].value, 'Chrome');
                    done();
                }
                decoder.on('finish', function() {
                    assert.equal(0, 1, 'hit end of file without finding tag.');
                    done();
                });
            });
            decoder.write(data);
        });

        it('should get a correct SimpleBlock time payload from a video/webm; codecs="avc1.42E01E" file (binary)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'SimpleBlock') {
                    if (chunk[1].value > 0) {

                        /* look at second simpleBlock */
                        assert.equal(chunk[1].payload.byteLength, 43, 'payload length');
                        assert.equal(chunk[1].track, 1, 'track');
                        assert.equal(chunk[1].value, 96, 'value (timestamp)');
                        done();
                    }
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });


        /* vP8 */
        data = fs.readFileSync('media/video-webm-codecs-vp8.webm');


        it('should get a correct PixelWidth value from a video/webm; codecs="vp8" file (2-byte unsigned int)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'PixelWidth') {
                    assert.equal(chunk[1].value, 352);
                    done();
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

        it('should get a correct EBMLVersion value from a video/webm; codecs="vp8" file (one-byte unsigned int)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'EBMLVersion') {
                    assert.equal(chunk[1].value, 1);
                    done();
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

        it('should get a correct TimeCodeScale value from a video/webm; codecs="vp8" file (3-byte unsigned int)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'TimecodeScale') {
                    assert.equal(chunk[1].value, 1000000);
                    done();
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

        it('should get a correct TrackUID value from a video/webm; codecs="vp8" file (56-bit integer in hex)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'TrackUID') {
                    assert.equal(chunk[1].value, '306d02aaa74d06');
                    done();
                }
                decoder.on('finish', function() {
                    assert.equal(0, 1, 'hit end of file without finding tag.');
                    done();
                });
            });
            decoder.write(data);
        });

        it('should get a correct DocType value from a video/webm; codecs="vp8" file (ASCII text)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'DocType') {
                    assert.equal(chunk[1].value, 'webm');
                    done();
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

        it('should get a correct MuxingApp value from a video/webm; codecs="vp8" file (utf8 text)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'MuxingApp') {
                    assert.equal(chunk[1].value, 'Chrome');
                    done();
                }
            });
            decoder.write(data);
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
        });

        it('should get a correct SimpleBlock time payload rom a video/webm; codecs="vp8" file (binary)', function(done) {
            const decoder = new ebml.Decoder();
            decoder.on('data', function(chunk) {
                if (chunk[0] === 'tag' && chunk[1].name === 'SimpleBlock') {
                    if (chunk[1].value > 0) {

                        /* look at second simpleBlock */
                        assert.equal(chunk[1].payload.byteLength, 43, 'payload length');
                        assert.equal(chunk[1].track, 1, 'track');
                        assert.equal(chunk[1].value, 96, 'timestamp');
                        assert.equal(chunk[1].discardable, false, 'discardable');
                        done();
                    }
                }
            });
            decoder.on('finish', function() {
                assert.equal(0, 1, 'hit end of file without finding tag.');
                done();
            });
            decoder.write(data);
        });

    });
});
