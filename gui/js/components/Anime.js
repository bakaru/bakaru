import React, { Component } from 'react';

/**
 * @param {AnimeFolder} folder
 * @returns {XML}
 * @constructor
 */
export default class Anime extends Component {
  constructor(props) {
    super(props);

    this.selected = {
      dub: false,
      sub: false,
      eps: []
    };

    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(props) {
    this.folder = props.folder;
    this.actions = props.actions;

    if (this.folder !== false) {
      this.selected = {
        dub: props.folder.dubs[0]
          ? props.folder.dubs[0].id
          : false,
        sub: props.folder.subs[0]
          ? props.folder.subs[0].id
          : false,
        eps: []
      };
    }
  }

  render() {
    if (this.folder === false) {
      return (
        <anime>
          Choose something!
        </anime>
      );
    }

    const episodes = this.renderEps(this.folder.episodes);
    const dubs = this.renderDubs(this.folder.dubs);
    const subs = this.renderSubs(this.folder.subs);

    return (
      <anime>
        <summary>
          <title>{ this.folder.name }</title>
          <path>{ this.folder.path }</path>
        </summary>
        <backery>
          <selectors>
            <select defaultValue={ this.selected.dub } onChange={ ::this.handleDubSelect }>
              { dubs.length > 0 ? dubs : (<option>No dubs</option>) }
            </select>
            <select defaultValue={ this.selected.sub } onChange={ ::this.handleSubSelect }>
              { subs.length > 0 ? subs : (<option>No subs</option>) }
            </select>
          </selectors>
          <subtitle>Episodes</subtitle>
          <episodes>
            { episodes }
          </episodes>
          <subtitle>Settings</subtitle>
          <settings>
            Settings here
          </settings>
          <actions>
            <button onClick={ ::this.handlePlayAllClick }>
              Play all
            </button>
          </actions>
        </backery>
      </anime>
    );
  }

  handlePlayAllClick() {
    let dub = false;
    let sub = false;

    if (this.selected.dub !== false) {
      dub = this.folder.dubs.filter(dub => dub.id === this.selected.dub)[0];
    }

    if (this.selected.sub !== false) {
      sub = this.folder.subs.filter(sub => sub.id === this.selected.sub)[0];
    }

    const playlist = [];

    this.folder.episodes.map((episode, index) => {
      const item = {
        videoPath: `file:///${episode.path}`,
        audioPath: false,
        subtitlesPath: false
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
    this.actions.playerPlay();
  }

  handleDubSelect(event) {
    this.selected.dub = event.target.value;
  }

  handleSubSelect(event) {
    this.selected.sub = event.target.value;
  }

  renderOption(id, name) {
    return (
      <option value={ id } key={ id }>
        { name }
      </option>
    );
  }

  renderSubs(subs) {
    return subs.map(sub => this.renderOption(sub.id, sub.name));
  }

  renderDubs(dubs) {
    return dubs.map(dub => this.renderOption(dub.id, dub.name));
  }

  renderEps(eps) {
    return eps.map(episode => {
      return (
        <episode key={ episode.id }>
          { episode.name }
        </episode>
      );
    });
  }
}