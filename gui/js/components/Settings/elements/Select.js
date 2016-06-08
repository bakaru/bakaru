import React, { Component } from 'react';

import classname from 'classnames';

export default class Select extends Component {
  static propTypes = {
    onSelect: React.PropTypes.func.isRequired,
    options: React.PropTypes.instanceOf(Map).isRequired,
    selected: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      opened: false
    };

    this.documentClickListener = ::this.documentClickHandler;

    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(props) {
    this.onSelectCallback = props.onSelect;
    this.options = props.options;
    this.selected = props.selected;
  }
  
  componentWillMount() {
    window.document.addEventListener('click', this.documentClickListener);
  }
  
  componentWillUnmount() {
    window.document.removeEventListener('click', this.documentClickListener);
  }
  
  documentClickHandler(e) {
    (e.target.tagName !== 'SELECTED') && this.setState({ opened: false });
  }

  onSelect(optionId) {
    this.onSelectCallback(optionId);
  }

  render() {
    const items = [];

    this.options.forEach((title, id) => {
      items.push(
        <item onClick={ () => (this.onSelect(id), this.setState({ opened: false })) } key={ id }>
          { title }
        </item>
      );
    });

    const itemsClass = classname({
      opened: this.state.opened
    });

    return (
      <dropdown>
        <selected onClick={ () => this.setState({ opened: true }) }>
          { this.options.get(this.selected) }
        </selected>

        <items className={ itemsClass }>
          { items }
        </items>
      </dropdown>
    );
  }
}
