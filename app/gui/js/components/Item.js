import React, { Component } from 'react';
import { connect } from 'react-redux';

class Item extends Component {
  render () {
    const { id, getAnimeFolder, dispatch } = this.props;

    /**
     * @type {AnimeFolder}
     */
    const folder = getAnimeFolder(id);

    return (
      <item>
        <title>{ folder.name }</title>
      </item>
    );
  }
}

const mapPropsFromStore = store => ({
  getAnimeFolder: id => store.folders.get(id)
});

export default connect(mapPropsFromStore)(Item);