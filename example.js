/* eslint no-console:off */
const ebml = require('./index.js');
const fs = require('fs');

const decoder = new ebml.Decoder();

decoder.on('data', chunk => console.log(chunk));

fs.readFile('media/test.webm', (err, data) => {
    if (err) {
        throw err;
    }
    decoder.write(data);
});
