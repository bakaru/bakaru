import React, { Component } from 'react';

import { ChromePicker } from 'react-color';
import Checkbox from './elements/Checkbox';
import Select from './elements/Select';

import classname from 'classnames';

export default class Settings extends Component {

  /**
   * Ctor
   * @param props
   */
  constructor(props) {
    super(props);

    this.state = {
      pane: 'player'
    };

    this.blurTo = 'library';
    this.actions = props.actions;

    this.componentWillReceiveProps(props);
  }

  /**
   * Do you even props bruh?
   *
   * @param props
   */
  componentWillReceiveProps(props) {
    this.settings = props.settings;
    this.isFocused = props.focus === 'settings';

    if (!this.isFocused) {
      this.blurTo = props.focus;
    }
  }

  /**
   * Blur settings to previous screen
   */
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

  /**
   * Render all the things
   *
   * @returns {XML}
   */
  render() {
    const settingsClass = classname({
      hidden: !this.isFocused
    });

    return (
      <settings className={ settingsClass }>
        <exit onClick={ () => this.blur() }>
          Close
        </exit>
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
          <tab onClick={ () => this.setState({ pane: 'interface' }) } className={ this.state.pane === 'interface' ? 'shown' : '' }>
            Interface
          </tab>
        </tabs>

        { [this.renderPlayerPane(), this.renderLibraryPane(), this.renderInterfacePane()] }
      </settings>
    );
  }

  /**
   * Render player settings pane
   *
   * @returns {XML}
   */
  renderPlayerPane() {
    const afterPlayActions = new Map([
      ['next', 'Play next in playlist'],
      ['nothing', 'Do nothing'],
      ['library', 'Go back to library'],
      ['wait', 'Wait 7 seconds and play next in playlist']
    ]);

    return (
      <pane className={ this.state.pane === 'player' ? 'shown' : '' } key="player">
        <title>
          Player
        </title>

        <row onClick={ () => this.save('player_pause_on_click', !this.settings.player_pause_on_click) }>
          <name>Pause on click { this.path() }</name>
          <control>
            <Checkbox checked={ this.settings.player_pause_on_click }/>
          </control>
        </row>

        <row>
          <name>After media end { this.path() }</name>
          <control>
            <Select
              onSelect={ (actionId) => this.save('player_after_play_action', actionId) }
              options={ afterPlayActions }
              selected={ this.settings.player_after_play_action }
            />
          </control>
        </row>
      </pane>
    );
  }

  /**
   * Render library settings pane
   *
   * @returns {XML}
   */
  renderLibraryPane() {
    return (
      <pane className={ this.state.pane === 'library' ? 'shown' : '' } key="library">
        <title>
          Library
        </title>

        <row>
          <name>
            MB MAL settings will be here, I dunno yet
          </name>
        </row>
      </pane>
    );
  }

  renderInterfacePane() {
    return (
      <pane className={ this.state.pane === 'interface' ? 'shown' : '' } key="interface">
        <title>
          Interface
        </title>

        <row onClick={ () => this.save('player_match_size', !this.settings.player_match_size) }>
          <name>
            Match window size to video size
          </name>
          <control>
            <Checkbox checked={ this.settings.player_match_size }/>
          </control>
        </row>

        <row>
          <name>
            Main colo<b>u</b>r
          </name>
          <control>
            <ChromePicker
              color={ this.settings.interface_main_colour }
              onChange={ ({ hex }) => this.save('interface_main_colour', hex) }
            />
          </control>
        </row>
      </pane>
    );
  }

  /**
   * Lol
   *
   * @returns {XML}
   */
  path() {
    return (
      <path>
        ................................................................................................................
      </path>
    );
  }

  /**
   * Save setting value
   *
   * @param settingName
   * @param value
   */
  save(settingName, value) {
    this.actions.settingsSave(settingName, value);
  }
}
