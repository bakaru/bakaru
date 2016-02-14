import React from 'react';

export default function Header({ minimizeMainWindow, openSelectFolderDialog, flags, playerStatus, playerState, actions }) {
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
    <header className={ playerState === 'focused' ? 'hidden' : '' }>
      <title onClick={ () => console.log('it works!') }>BAKARU バカル</title>
      <actions>
        { addFolderButton }
        <button onClick={ () => window.location.reload() }>
          Reload
        </button>
        <button disabled={ playerStatus !== 'paused' } onClick={ () => { actions.playerPlay();actions.playerFocus(); } }>
          <i className="fa fa-play"></i> Continue playing
        </button>
      </actions>
      <controls>
        <minimize onClick={ () => minimizeMainWindow() }>
          -
        </minimize>
        <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={ () => window.close() }/>
      </controls>
    </header>
  );
}
