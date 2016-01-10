import React, { Component } from 'react';
import { connect } from 'react-redux';

class Item extends Component {
  render () {
    const { id, getAnimeFolder, dispatch } = this.props;

    /**
     * @type {AnimeFolder}
     */
    const folder = getAnimeFolder(id);

    const summary = [];

    if (folder.state.scanning) {
      summary[summary.length] = `Scanning in progress`;
    }
    if (folder.episodes.length > 0) {
      summary[summary.length] = `Episodes: ${folder.episodes.length}`;
    }
    if (folder.dubs.length > 0) {
      summary[summary.length] = `Dubs: ${folder.dubs.length}`;
    }
    if (folder.subs.length > 0) {
      summary[summary.length] = `Subs: ${folder.subs.length}`;
    }
    if (folder.bonuses.length > 0) {
      summary[summary.length] = `Bonuses: ${folder.bonuses.length}`;
    }

    return (
      <item>
        <title>
          { folder.name }
        </title>
        <summary>
          { summary.join(' • ') }
        </summary>
      </item>
    );
  }
}

const mapPropsFromStore = store => ({
  getAnimeFolder: id => store.folders.get(id)
});

export default connect(mapPropsFromStore)(Item);