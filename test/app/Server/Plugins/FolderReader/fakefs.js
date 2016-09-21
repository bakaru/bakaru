const mock = require('mock-fs');

const onlySeries = {
  's1': {
    'subs': {
      'e1.ass': '',
      'e2.ass': '',
      'e3.ass': ''
    },
    'dubs': {
      'dub1': {
        'e1.mka': '',
        'e2.mka': '',
        'e3.mka': ''
      },
      'dub2': {
        'e1.mka': '',
        'e2.mka': '',
        'e3.mka': ''
      },
      'wtf.mka': ''
    },
    'e1.mkv': '',
    'e2.mkv': '',
    'e3.mkv': ''
  },
  's2': {
    'subs': {
      'e1.ass': '',
      'e2.ass': '',
      'e3.ass': ''
    },
    'e1.mkv': '',
    'e2.mkv': '',
    'e3.mkv': ''
  }
};

const fs = {
  onlySeries
};

module.exports = {
  fs,

  override() {
    mock(fs);
  },

  restore: mock.restore
};
