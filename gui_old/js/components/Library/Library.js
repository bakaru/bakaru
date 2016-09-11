import React from 'react';
import Item from './Item';
import Entry from './Entry';
import { remote } from 'electron';

const { Menu, MenuItem } = remote;
import LibraryEvents from 'utils/LibraryEvents';

import classname from 'classnames';

let contextEntryId = null;

let contextMenu = new Menu();

contextMenu.append(new MenuItem({
  label: 'Play all',
  click: () => {
    console.log(`Playing all for id: ${contextEntryId}`);
  }
}));
contextMenu.append(new MenuItem({type: 'separator'}));
contextMenu.append(new MenuItem({
  label: 'Delete from library',
  click: () => {
    LibraryEvents.removeEntry(contextEntryId);
  }
}));

function openContextMenu (id) {
  contextEntryId = id;

  contextMenu.popup(remote.getCurrentWindow());
}

/**
 * @param folder
 * @param folders
 * @param openedFolder
 * @returns {XML}
 * @constructor
 */
export default function Library(props) {
  /** @var {LibraryState} */
  const library = props.library;
  /** @var {Map.<string, AnimeFolder> */
  const entries = library.entries;

  const selectedEntry = library.selected
    ? entries.get(library.selected)
    : false;

  const {
    actions,
    focus
  } = props;

  const sortedEntries = [...entries.keys()].sort((a, b) => {
    const aFolder = entries.get(a);
    const bFolder = entries.get(b);

    return aFolder.title.toLowerCase().charCodeAt(0) - bFolder.title.toLowerCase().charCodeAt(0);
  });

  const entriesList = new Array(sortedEntries.length);

  for (let index = 0; index < sortedEntries.length; index++) {
    const id = sortedEntries[index];

    entriesList[index] = (
      <Item key={ id } id={ id } onContextMenu={ () => openContextMenu(id) } />
    );
  }

  const libraryClass = classname({
    hidden: focus !== 'library'
  });

  return (
    <library className={ libraryClass }>
      <list>
        <bar>
          <search>
            <input type="search" placeholder="Quick search" />
          </search>
          <adder onClick={ () => props.openSelectFolderDialog() } title="Add new anime or bunch of'em">
            <i className="fa fa-plus"></i>
          </adder>
        </bar>
        { entriesList }
      </list>
      <Entry entry={ selectedEntry } actions={ actions }/>
    </library>
  );
}
