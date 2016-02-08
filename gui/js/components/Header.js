import React from 'react';

export default function Header({ minimizeMainWindow, openSelectFolderDialog, flags }) {
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
    <header>
      <title>BAKARU バカル</title>
      <actions>
        { addFolderButton }
        <button onClick={ () => window.location.reload() }>
          Reload
        </button>
      </actions>
      <controls>
        <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={ () => window.close() }/>
        <minimize onClick={ () => minimizeMainWindow() }>
          -
        </minimize>
      </controls>
    </header>
  );
}
