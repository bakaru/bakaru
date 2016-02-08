'use strict';

const parseString = require('xml2js').parseString;
const execFile = require('child_process').execFile;

class MediaInfo {

  /**
   * @param {string} executable
   */
  constructor(executable) {
    this.executable = executable;

    this.defaultArgs = [
      '--Output=XML'
    ];
  }

  getInfo(filepaths) {
    if (filepaths.length > 10) {
      const chunks = [[filepaths[0]]];
      let currentChunk = 0;

      for (let i = 1; i < filepaths.length; i++) {
        if (i%10 === 0) {
          currentChunk++;
          chunks[currentChunk] = [];
        }

        chunks[currentChunk].push(filepaths[i]);
      }

      return Promise.all(chunks.map(chunk => {
        return this.getInfoChunked(chunk);
      })).then(infoChunks => {
        const map = [];

        infoChunks.map(infoChunk => map.push.apply(map, [...infoChunk]));

        return new Map(map);
      });
    } else {
      return this.getInfoChunked(filepaths);
    }
  }

  /**
   * @api
   * @param {string[]} filepaths
   * @returns {Promise<TResult>|Promise.<T>}
   */
  getInfoChunked(filepaths) {
    const promise = new Promise((resolve, reject) => {
      execFile(
        this.executable,
        filepaths.concat(this.defaultArgs),
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
      .then(mediaInfo => this.parseXml(mediaInfo))
      .then(mediaObject => {
        const infoBase = {
          duration: null,
          video: null,
          audio: [],
          subtitles: []
        };

        const files = new Map();

        for (let fileIndex in mediaObject.Mediainfo.File) {
          const info = Object.assign({}, infoBase);

          info.audio = [];
          info.subtitles = [];

          const tracks = mediaObject.Mediainfo.File[fileIndex].track || [];
          let filepath;

          for (let trackIndex in tracks) {
            const track = tracks[trackIndex];

            switch (track.$.type) {
              case 'General':
                filepath = track.Complete_name[0];

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

          files.set(filepath, info);
        }

        return files;
      });
  }

  /**
   * @private
   * @param string
   * @returns {Promise}
   */
  parseXml(string) {
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
}

module.exports = MediaInfo;
