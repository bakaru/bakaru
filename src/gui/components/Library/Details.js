import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Player from 'gui/control/Player'
import className from 'classnames'
import * as icons from 'gui/components/icons'

export default class Details extends Component {
  static propTypes = {
    entry: PropTypes.object,
    isShyLibrary: PropTypes.bool.isRequired,
    switchToLibrary: PropTypes.func.isRequired,
    switchToPlayer: PropTypes.func.isRequired,

    currentEntryId: PropTypes.string,
    currentEpisodeId: PropTypes.string,
  };

  static defaultProps = {
    entry: null,
    currentEntryId: null,
    currentEpisodeId: null,
  };

  state = {
    audioSelectorOpen: false
  };

  onToggleAudioSelector(e) {
    e.stopPropagation();

    this.setState({ audioSelectorOpen: !this.state.audioSelectorOpen });
  }

  onPlay(episodeId = null) {
    const entry = this.props.entry;

    const entryId = entry.id;

    Player.media(
      entryId,
      episodeId || [...entry.episodes.keys()][0]
    );

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
      const entryClassName = className({
        watched: episode.watched,
        current: entry.id === props.currentEntryId && id === props.currentEpisodeId
      })

      episodes.push(
        <div
          key={id}
          className={entryClassName}
          onClick={() => this.onPlay(id)}
        >
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
          <h3>
            {entry.title}
          </h3>
          <div className="entry-path">
            {entry.path}
          </div>
        </header>

        <section className="controls">
          <div className={audioSelectorClass}>
            <div className="angle">
              {icons.angleRight}
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
              {icons.angleRight}
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
            onClick={() => this.onPlay()}
          >
            {icons.play}
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
