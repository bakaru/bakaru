import React, { Component } from 'react';
import classNames from 'classnames';
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

    /**
     * @type {Anime|boolean}
     */
    this.entry = false;

    this.mounted = false;

    this.componentWillReceiveProps(props);
  }

  /**
   * Fuck off react, plz
   */
  componentDidMount() {
    this.mounted = true;

    // Uh-hu, wut?!
    this.componentWillReceiveProps(this);
  }

  /**
   * Updates state
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    this.entry = props.entry;
    this.actions = props.actions;

    if (this.entry !== false && this.mounted) {
      this.setState({
        dub: this.entry.dubs.size
          ? [...this.entry.dubs.keys()][0]
          : false,
        sub: false, // LETS NOT, OK?!
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
          <title>{ this.entry.title }</title>
          <path onClick={ ::this.handleEntryPathClick }>{ this.entry.path }</path>
        </summary>

        <actions>
          <btn onClick={ ::this.handlePlayAllClick }>
            Play all
          </btn>
        </actions>

          { this.entry.subs.size ? subs : '' }
          { dubs }

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
    const playlist = [];

    this.entry.episodes.forEach((episode, episodeId) => {
      playlist.push({
        entryId: this.entry.id,
        episodeId: episodeId,
        dubId: this.state.dub,
        subId: this.state.sub,
        videoFrameSize: [this.entry.width, this.entry.height]
      });
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
   * @param {string|boolean} sub
   */
  handleSubSelect(sub) {
    if (sub === this.state.sub) {
      sub = false;
    }

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

    const rendered = [];

    subs.forEach(sub => {
      const subClass = classNames({
        selected: this.state.sub === sub.id,
        embedded: sub.embedded
      });

      rendered.push(
        <div
          key={ sub.id }
          title={ sub.title }
          className={ subClass }
          onClick={ () => ::this.handleSubSelect(sub.id) }
        >
          <span className="icon" title="Embedded subtitles">
            { sub.embedded ? this.renderEmbeddedIcon() : '' }
          </span>
          { sub.title }
        </div>
      );
    });

    return (
      <list>
        <title>Subtitles</title>
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

    const rendered = [];

    dubs.forEach(dub => {
      const dubClass = classNames({
        selected: this.state.dub === dub.id,
        embedded: dub.embedded
      });

      rendered.push(
        <div
          key={ dub.id }
          title={ dub.title }
          className={ dubClass }
          onClick={ () => ::this.handleDubSelect(dub.id) }
        >
          <span className="icon" title="Embedded dubs">
            { dub.embedded ? this.renderEmbeddedIcon() : '' }
          </span>
          { dub.title }
        </div>
      );
    });

    return (
      <list>
        <title>Voice-overs</title>
        { rendered }
      </list>
    );
  }

  renderEmbeddedIcon() {
    return 'Embedded';
  }

  /**
   * Episodes renderer
   *
   * @param eps
   * @returns {*}
   */
  renderEps(eps) {
    const rendered = [];

    eps.forEach(episode => {
      let duration;

      switch (episode.duration) {
        case false:
          duration = '';
          break;

        case -1:
          duration = 'File not completely downloaded';
          break;

        default:
          duration = this.secondsToHms(episode.duration/1000);
          break;
      }

      rendered.push(
        <div key={ episode.id } title={ episode.title }>
          { episode.title }
          <filename>
            { duration }
          </filename>
        </div>
      );
    });

    return rendered;
  }

  /**
   * Converts seconds to human format of hh:mm:ss
   *
   * @param {number} d
   * @returns {string}
   */
  secondsToHms(d) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);
    return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
  }
}