import React, { Component } from 'react';
import PlayerControls from 'utils/PlayerControls';

/**
 * @param {AnimeFolder} folder
 * @returns {XML}
 * @constructor
 */
export default class Entry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dub: false,
      sub: false,
      eps: []
    };

    this.componentWillReceiveProps(props);
  }

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

  render() {
    if (this.entry === false) {
      return (
        <entry>
          <greeting>
            <i className="fa fa-long-arrow-left"></i> Select anime
          </greeting>
        </entry>
      );
    }

    const episodes = this.renderEps(this.entry.episodes);
    const dubs = this.renderDubs(this.entry.dubs);
    const subs = this.renderSubs(this.entry.subs);

    return (
      <entry>
        <summary>
          <title>{ this.entry.name }</title>
          <path>{ this.entry.path }</path>
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
    PlayerControls.play();
  }

  handleDubSelect(dub) {
    this.setState({ dub });
  }

  handleSubSelect(sub) {
    this.setState({ sub });
  }

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

  renderEps(eps) {
    return eps.map(episode => {
      return (
        <div key={ episode.id } title={ episode.name }>
          { episode.name }
        </div>
      );
    });
  }
}