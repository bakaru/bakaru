import mock from 'mock-fs';

export default {
  root: '/root',
  title: 'Some Anime Name',
  subs: [
    'sub1',
    'sub2'
  ],
  dubs: [
    'dub1'
  ],
  episodes: [
    'ep1',
    'ep2'
  ],
  override () {
    mock({
      '/root/Some Anime Name': {
        'subs': {
          'sub1': {
            'ep1.ass': '',
            'ep2.ass': ''
          }
        },
        'dub1': {
          'ep1.mka': '',
          'ep2.mka': ''
        },
        'sub2': {
          'ep1.ass': '',
          'ep2.ass': ''
        },
        'ep1.mkv': '',
        'ep2.mkv': ''
      }
    });
  },
  restore () {
    mock.restore();
  }
};