import React, { Component } from 'react';
import { connect } from 'react-redux';

class Anime extends Component {
  render () {
    const { folder } = this.props;

    return (
      <anime>
        Open one on the left
        <br/>
        <pre>{ JSON.stringify(folder, null ,2) }</pre>
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