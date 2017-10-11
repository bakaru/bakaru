import React from 'react'
import className from 'classnames'

export default function Item(props) {
  let episodesWatched = 0;
  const episodesTotal = props.item.episodes.size;

  for (const episode of props.item.episodes.values()) {
    if (episode.watched) {
      episodesWatched++;
    }
  }

  const itemClassName = className({
    'library-item': true,
    'mod-selected': props.selected
  });

  return (
    <div
      className={itemClassName}
      onClick={props.select}
    >
      <div className="title">
        {props.item.title}
      </div>
      <div className="counter">
        {episodesWatched}/{props.item.episodes.size}
      </div>
      <Progress width={100 * (episodesWatched / episodesTotal)}/>
    </div>
  );
}

function Progress({ width }) {
  return (
    <div className="progress" style={{ width: `calc(${width}% + 6px)` }}/>
  );
}
