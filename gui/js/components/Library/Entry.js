import React, { Component } from 'react';
import PlayerControls from 'utils/PlayerControls';

import { shell } from 'electron';

/**
 * @param {AnimeFolder} folder
 * @returns {XML}
 * @constructor
 */
export default class Entry extends Component {

  /**
   * Ctor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      dub: false,
      sub: false,
      eps: []
    };

    this.componentWillReceiveProps(props);
  }

  /**
   * Updates state
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    this.entry = props.entry;
    this.actions = props.actions;

    if (this.entry !== false) {
      this.setState({
        dub: this.entry.dubs[0]
          ? this.entry.dubs[0].id
          : false,
        sub: this.entry.subs[0]
          ? this.entry.subs[0].id
          : false,
        eps: []
      });
    }
  }

  /**
   * Renderer
   *
   * @returns {XML}
   */
  render() {
    if (this.entry === false) {
      return this.renderPlaceholder();
    }

    const episodes = this.renderEps(this.entry.episodes);
    const dubs = this.renderDubs(this.entry.dubs);
    const subs = this.renderSubs(this.entry.subs);

    return (
      <entry>
        <summary>
          <title>{ this.entry.name }</title>
          <path onClick={ ::this.handleEntryPathClick }>{ this.entry.path }</path>
        </summary>

        <actions>
          <btn onClick={ ::this.handlePlayAllClick }>
            Play all
          </btn>
        </actions>

        <list-row>
          { subs }
          { dubs }
        </list-row>

        <list>
          <title>Episodes</title>
          { episodes }
        </list>
      </entry>
    );
  }

  renderPlaceholder() {
    return (
      <entry>
        <greeting>
          <i className="fa fa-long-arrow-left"></i> Select anime
        </greeting>
      </entry>
    );
  }

  /**
   * Play all button handler
   */
  handlePlayAllClick() {
    let dub = false;
    let sub = false;

    if (this.state.dub !== false) {
      dub = this.entry.dubs.filter(dub => dub.id === this.state.dub)[0];
    }

    if (this.state.sub !== false) {
      sub = this.entry.subs.filter(sub => sub.id === this.state.sub)[0];
    }

    const playlist = [];

    this.entry.episodes.map((episode, index) => {
      const item = {
        title: `${this.entry.name} - ${episode.name}`,
        videoPath: `file:///${episode.path}`,
        audioPath: false,
        subtitlesPath: false,
        videoFrameSize: [this.entry.media.width, this.entry.media.height]
      };

      if (dub !== false) {
        item.audioPath = `file:///${dub.files[index]}`;
      }

      if (sub !== false) {
        item.subtitlesPath = `file:///${sub.files[index]}`;
      }

      playlist.push(item);
    });

    this.actions.playerSetPlaylist(playlist);
    this.actions.focusOnPlayer();
    PlayerControls.play(true);
  }

  /**
   * Handles dub select
   *
   * @param {string} dub
   */
  handleDubSelect(dub) {
    this.setState({ dub });
  }

  /**
   * Handles sub select
   *
   * @param {string} sub
   */
  handleSubSelect(sub) {
    this.setState({ sub });
  }

  /**
   * Handles click on entry path
   */
  handleEntryPathClick() {
    shell.openItem(this.entry.path);
  }

  /**
   * Subs renderer
   *
   * @param subs
   * @returns {*}
   */
  renderSubs(subs) {
    if (subs.length === 0) {
      return '';
    }

    const rendered = subs.map(sub => {
      const isSelected = this.state.sub === sub.id;

      return (
        <div
          key={ sub.id }
          title={ sub.name }
          className={ isSelected ? 'selected' : '' }
          onClick={ () => ::this.handleSubSelect(sub.id) }
        >
          { sub.name }
        </div>
      );
    });

    return (
      <list>
        <title>Subs</title>
        { rendered }
      </list>
    );
  }

  /**
   * Dubs renderer
   *
   * @param dubs
   * @returns {*}
   */
  renderDubs(dubs) {
    if (dubs.length === 0) {
      return '';
    }

    const rendered = dubs.map(dub => {
      const isSelected = this.state.dub === dub.id;

      return (
        <div
          key={ dub.id }
          title={ dub.name }
          className={ isSelected ? 'selected' : '' }
          onClick={ () => ::this.handleDubSelect(dub.id) }
        >
          { dub.name }
        </div>
      );
    });

    return (
      <list>
        <title>Dubs</title>
        { rendered }
      </list>
    );
  }

  /**
   * Episodes renderer
   *
   * @param eps
   * @returns {*}
   */
  renderEps(eps) {
    return eps.map(episode => {
      return (
        <div key={ episode.id } title={ episode.name }>
          { episode.name }
          <filename>
            { episode.filename }
          </filename>
        </div>
      );
    });
  }
}