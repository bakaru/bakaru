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
        duration: null,
        video: null,
        audio: [],
        subtitles: []
      };

      const tracks = mediaObject.Mediainfo.File[0].track || [];

      for (let trackIndex in tracks) {
        const track = tracks[trackIndex];

        switch (track.$.type) {
          case 'General':
            if (track.Duration) {
              info.duration = track.Duration[0];
            }
            break;

          case 'Video':
            if (info.video === null) {
              const width = track.Width.length
                ? parseInt(track.Width[0].replace('pixels', '').replace(' ', ''))
                : false;
              const height = track.Height.length
                ? parseInt(track.Height[0].replace('pixels', '').replace(' ', ''))
                : false;
              const fps = track.Frame_rate.length
                ? parseFloat(track.Frame_rate[0].replace('fps', '').replace(' ', ''))
                : false;
              const bitDepth = track.Bit_depth[0] || '8 bits';

              info.video = {
                id: track.ID[0],
                format: track.Format[0],
                width,
                height,
                fps,
                bitDepth: parseInt(bitDepth.replace('bits', '').replace(' ', ''))
              };
            }
            break;

          case 'Audio':
            info.audio.push({
              id: track.ID[0],
              format: track.Format[0],
              title: track.Title
                ? track.Title[0]
                : false,
              language: track.Language
                ? track.Language[0]
                : false
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
