import React from 'react'
import Backend from 'shared/Backend'
import Event from 'shared/Event'
import Item from './Item'

function openDialog() {
  Backend.emit(Event.OpenSystemFolder);
}

export default function List(props) {
  const items = [];

  for (const item of props.items.values()) {
    items.push(
      <Item
        key={item.id}
        item={item}
        select={() => props.select(item.id)}
        selected={props.selected === item.id}
      />
    );
  }

  return (
    <div className="library-list">
      {items}
      {/*<button*/}
        {/*onClick={openDialog}*/}
      {/*>*/}
        {/*Add*/}
      {/*</button>*/}
      <div style={{ height: '2000px' }}></div>
    </div>
  );
}
