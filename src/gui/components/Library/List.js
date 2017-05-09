import Inferno from 'inferno'
import Backend from 'shared/Backend'
import Event from 'shared/Event'
import Item from './Item'

function openDialog() {
  Backend.emit(Event.OpenSystemFolder);
}

export default function List(props) {
  const items = [];

  for (const item of props.items.values()) {
    console.log(item);

    items.push(
      <Item key={item.id} item={item}/>
    );
  }

  return (
    <div className="library-list">
      {items}
      <button
        onClick={openDialog}
      >
        Add
      </button>
    </div>
  );
}
