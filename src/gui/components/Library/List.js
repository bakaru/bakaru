import React from 'react'
import Item from './Item'

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
    </div>
  );
}
