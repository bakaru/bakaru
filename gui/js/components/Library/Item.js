import React, { Component } from 'react';
import { connect } from 'react-redux';

import { openAnimeFolder } from 'actions';

class Item extends Component {
  render () {
    const { id, getAnimeFolder, selectedEntryId, selectEntry } = this.props;

    /**
     * @type {AnimeFolder}
     */
    const folder = getAnimeFolder(id);
    const isOpened = selectedEntryId === id;
    const summary = [];

    if (folder.state.scanning || folder.state.subScanning || folder.state.mediainfoScanning) {
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

    summary[summary.length] = `Quality: ${folder.quality}`;

    return (
      <item className={ isOpened ? 'opened' : '' } onClick={ () => selectEntry(id) }>
        <title title={ folder.name }>
          { folder.name }
        </title>
        <summary>
          { summary.join(' • ') }
        </summary>
      </item>
    );
  }
}

const mapStoreToProps = store => ({
  getAnimeFolder: id => store.library.entries.get(id),
  selectedEntryId: store.library.selected
});

const mapDispatchToProps = dispatch => ({
  selectEntry: id => dispatch(openAnimeFolder(id))
});

export default connect(mapStoreToProps, mapDispatchToProps)(Item);