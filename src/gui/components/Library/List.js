import React from 'react'
import Item from './Item'
import Backend from 'shared/Backend'
import Event from 'shared/Event'

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
      <div className="library-controls">
        <input
          type="search"
          placeholder="Boku no Pico"
        />

        <button
          onClick={openDialog}
          className="adder"
        >
          Add
        </button>
      </div>

      {items}
    </div>
  );
}
