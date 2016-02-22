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

        <actions>
          <button>
            Bake
          </button>
          <button onClick={ ::this.handlePlayAllClick }>
            Play all
          </button>
        </actions>

        <list-row>
          { subs }
          { dubs }
        </list-row>

        <list>
          <title>Episodes</title>
          { episodes }
        </list>
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
        title: `${this.folder.name} ${episode.name}`,
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
    this.actions.playerFocus();
    this.actions.playerPlay();
  }

  handleDubSelect(dubId) {
    this.selected.dub = dubId;
  }

  handleSubSelect(subId) {
    this.selected.sub = subId;
  }

  renderSubs(subs) {
    if (subs.length === 0) {
      return '';
    }

    const rendered = subs.map(sub => {
      const isSelected = this.selected.sub === sub.id;

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
      const isSelected = this.selected.dub === dub.id;

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