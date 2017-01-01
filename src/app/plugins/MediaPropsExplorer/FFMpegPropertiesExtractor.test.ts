const chai = require('chai');
import shallow = require('chai-shallow-deep-equal');
import 'mocha';

chai.use(shallow);

const expect = chai.expect;

import parse from './FFMpegPropertiesExtractor';

const mkvSimple = require('./stubs/test.mkv.json');
const mkvComplex = require('./stubs/test.mkv.complex.json');
const mp4Simple = require('./stubs/test.mp4.json');

const expectedParsedMkv = {
  size: 238225644,
  video:     {
    codec: 'h264',
    width: 720,
    height: 480,
    startTime: 0,
    bitsPerPixel: '8'
  },
  audios:    [{codec: 'ac3', channels: 2, bitRate: 224000, 'default': true, forced: false}],
  duration:  1533.098,
  chapters:  [
    {end: 95000, start: 0, title: 'Chapter 1'},
    {end: 184800, start: 95000, title: 'Chapter 2'},
    {end: 785200, start: 184800, title: 'Chapter 3'},
    {end: 1334700, start: 785200, title: 'Chapter 4'},
    {end: 1424600, start: 1334700, title: 'Chapter 5'},
    {end: 1441000, start: 1424600, title: 'Chapter 6'},
    {end: 1533098, start: 1441000, title: 'Chapter 7'}
  ],
  subtitles: [{language: 'eng', 'default': true, forced: false}]
};
const expectedParsedMp4 = {
  size:      1055736,
  video:     {
    codec: 'h264',
    width: 1280,
    height: 720,
    startTime: 0,
    bitsPerPixel: '8'
  },
  audios:    [
    {codec: 'aac', channels: 6, bitRate: 384828, 'default': true, forced: false}
  ],
  duration: 5.312,
  chapters: [],
  subtitles: []
};
const expectedParsedMkvComplex = {
  size: 604585930,
  duration: 1421.141,
  video: {
    codec: 'h264',
    width: 1280,
    height: 720,
    startTime: 0,
    bitsPerPixel: '8'
  },
  audios: [{
    bitRate: -1,
    codec: 'flac',
    channels: 2,
    'default': true,
    forced: false
  }],
  chapters: [
    {end: 31990, start: 0, title: 'OP'},
    {end: 729020, start: 31990, title: 'Episode 1'},
    {end: 1362460, start: 729020, title: 'Episode 2'},
    {end: 1421141, start: 1362460, title: 'ED'}
  ],
  subtitles: [
    {language: 'eng', 'default': true, forced: false}
  ]
};

describe('FFMpegPropertiesExtractor', () => {
  it('should parse correctly', () => {
    expect(parse(mkvSimple)).to.be.shallowDeepEqual(expectedParsedMkv);
    expect(parse(mkvComplex)).to.be.shallowDeepEqual(expectedParsedMkvComplex);
    expect(parse(mp4Simple)).to.be.shallowDeepEqual(expectedParsedMp4);
  });
});
