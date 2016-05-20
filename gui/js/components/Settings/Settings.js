import React, { Component } from 'react';

import classname from 'classnames';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pane: 'player'
    };

    this.blurTo = 'library';
    this.actions = props.actions;

    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(props) {
    this.isFocused = props.focus === 'settings';

    if (!this.isFocused) {
      this.blurTo = props.focus;
    }
  }

  blur () {
    switch (this.blurTo) {
      case 'library':
        this.actions.focusOnLibrary();
        break;

      case 'player':
        this.actions.focusOnPlayer();
        break;
    }
  }

  render() {
    const settingsClass = classname({
      hidden: !this.isFocused
    });

    return (
      <settings className={ settingsClass }>
        <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={ () => this.blur() }/>
        <tabs>
          <title>
            Settings
          </title>

          <tab onClick={ () => this.setState({ pane: 'player' }) } className={ this.state.pane === 'player' ? 'shown' : '' }>
            Player
          </tab>
          <tab onClick={ () => this.setState({ pane: 'library' }) } className={ this.state.pane === 'library' ? 'shown' : '' }>
            Library
          </tab>
        </tabs>

        { [this.renderPlayerPane(), this.renderSettingsPane()] }
      </settings>
    );
  }

  renderPlayerPane() {
    return (
      <pane className={ this.state.pane === 'player' ? 'shown' : '' } key="player">
        <title>
          Player
        </title>
        settings for player go here
      </pane>
    );
  }

  renderSettingsPane() {
    return (
      <pane className={ this.state.pane === 'library' ? 'shown' : '' } key="library">
        <title>
          Library
        </title>

        settings for library go here
      </pane>
    );
  }
}
