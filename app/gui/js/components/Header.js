import React from 'react';

export default function Header(props) {
  const { addFolder } = props.flags;
  const { minimizeMainWindow, openSelectFolderDialog } = props;

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
