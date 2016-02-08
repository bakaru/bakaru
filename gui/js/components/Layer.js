import React from 'react';
import Item from 'components/Item';
import Anime from 'components/Anime';

/**
 * @param folder
 * @param folders
 * @param openedFolder
 * @returns {XML}
 * @constructor
 */
export default function Layer({ folder, folders, openedFolder }) {
  const foldersSorted = [...folders.keys()].sort((a, b) => {
    const aFolder = folders.get(a);
    const bFolder = folders.get(b);

    return aFolder.name.toLowerCase().charCodeAt(0) - bFolder.name.toLowerCase().charCodeAt(0);
  });

  const foldersList = [];

  for (let index = 0; index < foldersSorted.length; index++) {
    const id = foldersSorted[index];

    foldersList[foldersList.length] = (
      <Item key={ id } id={ id } />
    );
  }

  let sideBar;

  if (openedFolder !== null) {
    sideBar = (<Anime key="sidebar" folder={ folder }/>);
  } else {
    sideBar = (
      <placeholder key="sidebar">
        Open one one the left!
      </placeholder>
    );
  }

  return (
    <layer>
      <list>
        { foldersList }
      </list>
      { sideBar }
    </layer>
  );
}
