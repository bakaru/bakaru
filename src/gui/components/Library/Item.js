import React from 'react'
import PropTypes from 'prop-types'
import className from 'classnames'
import Player from 'gui/control/Player'
import { remove } from 'gui/store/modules/library'
import * as icons from 'gui/components/icons'

function onPlay(switchToPlayer) {
  setMedia(this.props.entry);

  Player.play();

  switchToPlayer();
}

function onDelete(e, id) {
  e.stopPropagation();

  remove(id);
}

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
      <div className="button-group actions">
        <button
          className="negative"
          onClick={e => onDelete(e, props.item.id)}
        >
          {icons.minusCircle}
        </button>
        <button>
          {icons.play}
        </button>
      </div>
      <Progress width={100 * (episodesWatched / episodesTotal)}/>
    </div>
  );
}
Item.propTypes = {
  item: PropTypes.object.isRequired,
  select: PropTypes.func.isRequired,
  selected: PropTypes.bool.isRequired,
};

function Progress({ width }) {
  return (
    <div className="progress" style={{ width: `${width}%` }}/>
  );
}
