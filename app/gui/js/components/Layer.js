import React, { Component } from 'react';
import { connect } from 'react-redux';
import Item from 'components/Item';
import Anime from 'components/Anime';

class Layer extends Component {
  render () {
    const { folders, openedFolder } = this.props;

    const foldersList = [];

    for (let id of folders.keys()) {
      foldersList[foldersList.length] = (
        <Item key={ id } id={ id } />
      );
    }

    let sideBar;

    if (openedFolder !== null) {
      sideBar = (<Anime key="sidebar"/>);
    } else {
      sideBar = (
        <placeholder key="sidebar">
          Open one one the left!
        </placeholder>
      );
    }

    return (
      <layer>
        <list>
          { foldersList }
        </list>
        { sideBar }
      </layer>
    );
  }
}

const mapPropsFromStore = store => {
  return {
    folders: store.folders,
    openedFolder: store.state.openedFolder
  }
};

export default connect(mapPropsFromStore)(Layer);
