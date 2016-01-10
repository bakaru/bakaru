import React, { Component } from 'react';
import { connect } from 'react-redux';
import Item from 'components/Item';

class Layer extends Component {
  render () {
    const { folders } = this.props;

    const foldersList = [];

    for (let id of folders.keys()) {
      foldersList[foldersList.length] = (
        <Item key={ id } id={ id } />
      );
    }

    return (
      <layer>
        <list>
          { foldersList }
        </list>
        <anime>
          Open one on the left
        </anime>
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
