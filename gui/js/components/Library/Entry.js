import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import PlayerControls from 'utils/PlayerControls';
import {shell} from 'electron';
import LibraryEvents from 'utils/LibraryEvents';

/**
 * @param {AnimeFolder} folder
 * @returns {XML}
 * @constructor
 */
export default class Entry extends Component {

  static propTypes = {
    entry: PropTypes.object
  }

  static defaultProps = {
    entry: false
  }

  /**
   * Ctor
   *
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
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
        eps: []
      });
    }
  }

  /**
   * Renderer
   *
   * @returns {JSX.Element}
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
          <btn onClick={::this.handlePlayAllClick}>
            Play all
          </btn>
          <btn onClick={::this.handlePlayContinueClick}>
            Continue
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
          <i className="fa fa-long-arrow-left"/> Select anime
        </greeting>
      </entry>
    );
  }

  handlePlayContinueClick() {
    const playlist = [...this.entry.episodes.entries()]
      .filter(ep => !ep[1].watched)
      .map(ep => {
        return {
          entryId: this.entry.id,
          episodeId: ep[0],
          dubId: this.entry.selections.dubs,
          subId: this.entry.selections.subs
        };
      });

    PlayerControls.playlist(playlist, true);

    this.actions.focusOnPlayer();
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
        dubId: this.entry.selections.dubs,
        subId: this.entry.selections.subs
      });
    });

    PlayerControls.playlist(playlist, true);

    this.actions.focusOnPlayer();
  }

  /**
   * Handles dub select
   *
   * @param {string} dub
   */
  handleDubSelect(dub) {
    LibraryEvents.selectDub(this.entry.id, dub);
  }

  /**
   * Handles sub select
   *
   * @param {string|boolean} sub
   */
  handleSubSelect(sub) {
    if (this.entry.selections.subs === sub) {
      LibraryEvents.selectSub(this.entry.id, false);
    } else {
      LibraryEvents.selectSub(this.entry.id, sub);
    }
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
        selected: this.entry.selections.subs === sub.id,
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
        selected: this.entry.selections.dubs === dub.id,
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
      let stoppedAt;

      switch (episode.duration) {
        case false:
          duration = '';
          break;

        case -1:
          duration = 'File not completely downloaded';
          break;

        default:
          duration = this.secondsToHms(episode.duration / 1000);
          break;
      }

      if (episode.stoppedAt) {
        stoppedAt = this.secondsToHms(episode.stoppedAt / 1000);
      } else {
        stoppedAt = '00:00';
      }

      rendered.push(
        <episode className={ episode.watched ? 'watched' : '' } key={ episode.id } title={ episode.title }>
          { episode.title }
          <times>
            { stoppedAt } / { duration }
          </times>
        </episode>
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
    var h = Math.floor(d / 3600)
    var m = Math.floor(d % 3600 / 60)
    var s = Math.floor(d % 3600 % 60)

    return ((h > 0 ? h + ":" : "") + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" : "") + s)
  }
}