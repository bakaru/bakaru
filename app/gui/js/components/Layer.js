import React, { Component } from 'react';
import { connect } from 'react-redux';
import Item from 'components/Item';

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
        <Item key={ id } id={ id } />
      );
    }

    return (
      <layer>
        { foldersList }
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
