import React, { Component } from 'react';
import { connect } from 'react-redux';

class Anime extends Component {
  render () {
    const { folder } = this.props;

    const episodes = folder.episodes.map(episode => {
      return (
        <episode key={ episode.id }>
          { episode.name }
        </episode>
      );
    });

    return (
      <anime>
        <summary>
          <title>{ folder.name }</title>
          <path>{ folder.path }</path>
        </summary>
        <actions>
          <button>Bake</button>
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