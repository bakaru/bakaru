import React from 'react';
import Item from './Item';
import Entry from './Entry';

/**
 * @param folder
 * @param folders
 * @param openedFolder
 * @returns {XML}
 * @constructor
 */
export default function Library(props) {
  /**
   * @var {LibraryState}
   */
  const library = props.library;
  const entries = library.entries;

  const entry = library.selected
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

    return aFolder.name.toLowerCase().charCodeAt(0) - bFolder.name.toLowerCase().charCodeAt(0);
  });

  const entriesList = new Array(sortedEntries.length);

  for (let index = 0; index < sortedEntries.length; index++) {
    const id = sortedEntries[index];

    entriesList[index] = (
      <Item key={ id } id={ id } />
    );
  }

  return (
    <layer className={ focus === 'player' ? 'hidden' : '' }>
      <list>
        { entriesList }
      </list>
      <Entry entry={ entry } actions={ actions }/>
    </layer>
  );
}
