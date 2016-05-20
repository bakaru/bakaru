import React from 'react';
import Item from './Item';
import Entry from './Entry';

import classname from 'classnames';

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
    player,
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
      <Item key={ id } id={ id } />
    );
  }

  const libraryClass = classname({
    hidden: focus !== 'library'
  });

  return (
    <library className={ libraryClass }>
      <list>
        { entriesList }
        <adder onClick={ () => props.openSelectFolderDialog() }>
          <i className="fa fa-plus"></i> Add folder
        </adder>
      </list>
      <Entry entry={ selectedEntry } actions={ actions }/>
    </library>
  );
}
