'use strict';

const bluebird = require('bluebird');

const os = require('os');
const fs = require('fs');
const es = require('elegant-spinner')();
const lu = require('log-update');
const pb = require('progress');
const cp = bluebird.promisify(require('node-cp'));
const got = require('got');
const path = require('path');
const unzipper = require('decompress');

let downloadTarget = 'https://github.com/bakaru/bakaru-thirdparty/archive/win.zip';
const archTarget = path.join(os.tmpdir(), './bakaru-thirdparty.zip');
const unzipTarget = path.join(os.tmpdir(), './bakaru-thirdparty');
const copyTarget = path.join(__dirname, '../thirdparty') + '/';

download();

function download() {
  got.stream(downloadTarget)
    .on('response', res => {
      if ('content-length' in res.headers) {
        const total = parseInt(res.headers['content-length'], 10);
        const bar = new pb(`Downloading thirdparty: :percent :etas [:bar]`, { total, incomplete: ' ', width: 40 });

        res.on('data', chunk => {
          bar.tick(chunk.length);
        });
        res.on('end', () => {
          unzip();
        });
      }
    })
    .pipe(fs.createWriteStream(archTarget));
}

function unzip() {
  let lui = setInterval(() => {
    lu(`Extracting ${es()}`);
  }, 50);

  new unzipper()
    .src(archTarget)
    .dest(unzipTarget)
    .use(unzipper.zip({ strip: 1 }))
    .run(() => {
      clearInterval(lui);
      lu(`Extracting +`);
      copy();
    });
}

function copy() {
  let lui = setInterval(() => {
    lu(`Copying ${es()}`);
  }, 50);

  cp(unzipTarget, copyTarget).then(() => {
    clearInterval(lui);
    lu(`Copying +`);
    console.log('Done.');
  });
}
