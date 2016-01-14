import React, { Component } from 'react';
import { connect } from 'react-redux';
import Item from 'components/Item';
import Anime from 'components/Anime';

class Layer extends Component {
  render () {
    const { folders, openedFolder } = this.props;

    const foldersSorted = [...folders.keys()].sort((a, b) => {
      const aFolder = folders.get(a);
      const bFolder = folders.get(b);

      return aFolder.name.toLowerCase().charCodeAt(0) - bFolder.name.toLowerCase().charCodeAt(0);
    });

    const foldersList = [];

    for (let index = 0; index < foldersSorted.length; index++) {
      const id = foldersSorted[index];

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
