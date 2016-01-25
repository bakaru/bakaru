import React, { Component } from 'react';
import { connect } from 'react-redux';

class Anime extends Component {
  render () {
    /**
     * @type {AnimeFolder} folder
     */
    const { folder } = this.props;

    const episodes = folder.episodes.map(episode => {
      console.log(episode.mediainfo);

      return (
        <episode key={ episode.id }>
          { episode.name }
        </episode>
      );
    });

    const dubs = folder.dubs.map(dub => {
      return (
        <option value="{ dub.id }" key={ dub.id }>{ dub.name }</option>
      );
    });

    const subs = folder.subs.map(sub => {
      return (
        <option value="{ sub.id }" key={ sub.id }>{ sub.name }</option>
      );
    });

    return (
      <anime>
        <summary>
          <title>{ folder.name }</title>
          <path>{ folder.path }</path>
        </summary>
        <selectors>
          <select>
            { dubs.length > 0 ? dubs : (<option>No dubs</option>) }
          </select>
          <select>
            { subs.length > 0 ? subs : (<option>No subs</option>) }
          </select>
        </selectors>
        <actions>
          <button>Bake</button>
          <button>Run MPC-HC</button>
        </actions>
        <episodes>
          { episodes }
        </episodes>
      </anime>
    );
  }
}

const mapStoreToProps = store => ({
  folder: (openedFolder => {
    if (openedFolder === null) {
      return false;
    }

    return store.folders.get(openedFolder);
  })(store.state.openedFolder)
});

export default connect(mapStoreToProps)(Anime);
