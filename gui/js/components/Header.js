import React from 'react';
import BrowserWindow from 'utils/BrowserWindow';

export default function Header({ openSelectFolderDialog, flags, actions, playerActive, focus }) {
  const { addFolder } = flags;

  let addFolderButton;

  if (addFolder) {
    addFolderButton = (
      <button key="add-folder-button" onClick={ () => openSelectFolderDialog() } disabled={ addFolder }>
        <i className="fa fa-circle-o-notch fa-spin"></i>
      </button>
    );
  } else {
    addFolderButton = (
      <button key="add-folder-button" onClick={ () => openSelectFolderDialog() }>
        Add folder
      </button>
    );
  }

  return (
    <header className={ focus === 'player' ? 'hidden' : '' }>
      <title>BAKARU バカル</title>
      <actions>
        { addFolderButton }
        <button onClick={ () => window.location.reload() }>
          Reload
        </button>
        <button disabled={ !playerActive.length } onClick={ () => { actions.playerPlay();actions.focusOnPlayer(); } }>
          <i className="fa fa-play"></i> Continue playing
        </button>
      </actions>
      <controls>
        <minimize onClick={ () => BrowserWindow.minimize() }>
          -
        </minimize>
        <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={ () => window.close() }/>
      </controls>
    </header>
  );
}
