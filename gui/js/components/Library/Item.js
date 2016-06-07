import React, { Component } from 'react';
import { connect } from 'react-redux';
import classname from 'classnames';

import { openAnimeFolder } from 'actions';

class Item extends Component {
  render () {
    const { id, getAnimeFolder, selectedEntryId, selectEntry } = this.props;

    /**
     * @type {Anime}
     */
    const folder = getAnimeFolder(id);
    const isOpened = selectedEntryId === id;
    const summary = [];
    
    let isScanning = false;

    if (folder.state.scanning || folder.state.subScanning || folder.state.mediainfoScanning) {
      summary[summary.length] = `Scanning in progress`;
      isScanning = true;
    }
    if (folder.episodes.size > 0) {
      summary[summary.length] = `Episodes: ${folder.episodes.size}`;
    }
    if (folder.dubs.size > 0) {
      summary[summary.length] = `Dubs: ${folder.dubs.size}`;
    }
    if (folder.subs.size > 0) {
      summary[summary.length] = `Subs: ${folder.subs.size}`;
    }
    if (folder.bonuses.size > 0) {
      summary[summary.length] = `Bonuses: ${folder.bonuses.size}`;
    }

    summary[summary.length] = `Quality: ${folder.quality}`;

    const itemClass = classname({
      opened: isOpened,
      scanning: isScanning 
    });

    return (
      <item className={ itemClass } onClick={ () => selectEntry(id) }>
        <title title={ folder.title }>
          { folder.title }
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