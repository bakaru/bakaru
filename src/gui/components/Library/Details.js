import React, { Component } from 'react'
import Player from 'gui/control/Player'
import className from 'classnames'
import { play as playIcon, angleRight } from 'gui/components/icons'

export default class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioSelectorOpen: false
    };
  }

  onToggleAudioSelector(e) {
    e.stopPropagation();

    this.setState({ audioSelectorOpen: !this.state.audioSelectorOpen });
  }

  onPlay() {
    setMedia(this.props.entry);

    Player.play();

    this.props.switchToPlayer();
  }

  render () {
    const props = this.props;

    const openerClassName = className({
      'library-opener': true,
      'mod-visible': props.isShyLibrary
    })

    if (!props.entry) {
      return (
        <div className="library-details">
          <div className="library-details-placeholder">
            Select entry
          </div>
        </div>
      );
    }

    const entry = props.entry;

    const audioSelectorClass = className({
      'select': true,
      'mod-open': this.state.audioSelectorOpen
    });

    const episodes = [];

    for (const [id, episode] of entry.episodes) {
      episodes.push(
        <div key={id}>
          {episode.title}
        </div>
      );
    }

    return (
      <div className="library-details">
        <div
          className={openerClassName}
          onClick={props.switchToLibrary}
        >
          <span>Back to library</span>
        </div>

        <header>
          <div>
            {entry.title}
          </div>
          <div className="entry-path">
            {entry.path}
          </div>
        </header>

        <section className="controls">
          <div className={audioSelectorClass}>
            <div className="angle">
              {angleRight}
            </div>
            <div
              className="current"
              onClick={::this.onToggleAudioSelector}
            >
              something
            </div>
            <ul
              className="list"
              onClick={::this.onToggleAudioSelector}
            >
              <li>Test 1</li>
              <li>Test 2</li>
              <li>Test 2</li>
              <li>Test 2</li>
              <li>Test 2</li>
            </ul>
          </div>
          <div className={audioSelectorClass}>
            <div className="angle">
              {angleRight}
            </div>
            <div
              className="current"
              onClick={::this.onToggleAudioSelector}
            >
              something
            </div>
            <ul
              className="list"
              onClick={::this.onToggleAudioSelector}
            >
              <li>Test 1</li>
              <li>Test 2</li>
              <li>Test 2</li>
              <li>Test 2</li>
              <li>Test 2</li>
            </ul>
          </div>

          <button
            onClick={::this.onPlay}
          >
            {playIcon}
          </button>
        </section>

        <div className="episodes-wrapper">
          <section className="episodes">
            {episodes}
          </section>
        </div>
      </div>
    );
  }
}

function setMedia(entry) {
  const entryId = entry.id;
  const episodeId = [...entry.episodes.keys()][0];

  Player.media(entryId, episodeId);
}
