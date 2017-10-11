import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class MPV extends Component {
  static propTypes = {
    onReady: PropTypes.func.isRequired,
    onClickOnCanvas: PropTypes.func.isRequired,
    onPropertyChange: PropTypes.func.isRequired,
  };

  _node = null;

  /**
   * Send a command to the player.
   *
   * @param {string} cmd - Command name
   * @param {...*} args - Arguments
   */
  command(cmd, ...args) {
    args = args.map(arg => arg.toString());
    this._postData("command", [cmd].concat(args));
  }

  /**
   * Set a property to a given value.
   *
   * @param {string} name - Property name
   * @param {*} value - Property value
   */
  property(name, value) {
    this._postData("set_property", { name, value })
  }

  /**
   * Get a notification whenever the given property changes.
   *
   * @param {string} name - Property name
   */
  observe(name) {
    this._postData("observe_property", name);
  }

  _postData(type, data) {
    const msg = {type, data};
    this._node.postMessage(msg);
  }

  _handleMessage(e) {
    const msg = e.data;
    const {type, data} = msg;

    if (type === "property_change" && this.props.onPropertyChange) {
      const {name, value} = data;
      this.props.onPropertyChange(name, value);
    } else if (type === "ready" && this.props.onReady) {
      this.props.onReady(this);
    }
  }

  componentDidMount() {
    this._node.addEventListener("message", this._handleMessage.bind(this));
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const onMouseUp = e => {
      e.stopPropagation();
      this.props.onClickOnCanvas(e);
    }

    return (
      <embed
        ref={node => this._node = node}
        type="application/x-mpvjs"
        className="player-controller-mpv"
        onMouseUp={onMouseUp}
      />
    );
  }
}
