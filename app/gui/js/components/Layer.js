import React, { Component } from 'react';
import { connect } from 'react-redux';

class Layer extends Component {
  render () {
    const { folders } = this.props;

    const foldersList = [];

    for (let [id, folder] of folders) {
      const episodesList = folder.episodes.map(episode => {
        return (
          <li key={ episode.id }>
            <i>{ episode.name }</i>
          </li>
        );
      });

      foldersList[foldersList.length] = (
        <li key={ id }>
          <strong>{ folder.name }</strong>
          <i>{ JSON.stringify(folder.state) }</i>
          <ul>{ episodesList }</ul>
        </li>
      );
    }

    return (
      <layer>
        Im a frame!<br/>
        <ul>{ foldersList }</ul>
      </layer>
    );
  }
}

const mapPropsFromStore = store => {
  return {
    folders: store.folders
  }
};

export default connect(mapPropsFromStore)(Layer);
