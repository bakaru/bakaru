import { parseString } from 'xml2js';
import Promise from 'bluebird';
import { execFile } from 'child_process';
import { sep } from 'path';

let executable;

const defaultArgs = [
  '--Output=XML'
];

export function setThirdPartyDir(path) {
  executable = `${path}${sep}MediaInfo${sep}MediaInfo.exe`;
}

/**
 * @param {string} filepath
 * @returns {Promise<TResult>|Promise.<T>}
 */
export default function getInfo(filepath) {
  const promise = new Promise((resolve, reject) => {
    execFile(
      executable,
      [filepath].concat(defaultArgs),
      (err, output) => {
        if (err) {
          reject(err);
        } else {
          resolve(output.toString());
        }
      }
    );
  });

  return promise
    .then(mediaInfo => parseXml(mediaInfo))
    .then(mediaObject => {
      const info = {
        duration: '',
        video: null,
        audio: [],
        subtitles: []
      };

      const tracks = mediaObject.Mediainfo.File[0].track || [];

      for (let trackIndex in tracks) {
        const track = tracks[trackIndex];

        switch (track.$.type) {
          case 'General':
            info.duration = track.Duration;
            break;

          case 'Video':
            if (info.video === null) {
              info.video = {
                id: track.ID,
                format: track.Format,
                width: track.Width,
                height: track.Height,
                fps: track.Frame_rate,
                bitDepth: track.Bit_depth || '8 bits'
              };
            }
            break;

          case 'Audio':
            info.audio.push({
              id: track.ID,
              format: track.Format,
              title: track.Title,
              language: track.Language
            });
        }
      }

      return info;
    });
}

/**
 * @param string
 */
function parseXml(string) {
  return new Promise((resolve, reject) => {
    parseString(string, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
}