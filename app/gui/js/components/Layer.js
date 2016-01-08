import React, { Component } from 'react';
import { connect } from 'react-redux';
import { test as testie } from 'actions';

class Layer extends Component {
  render () {
    const { app, dispatch } = this.props;

    return (
      <layer>
        Im a frame!<br/>
        <button onClick={ () => dispatch(testie()) }>test</button>
        { app.readingFolder ? 'ya' : 'nah' }
      </layer>
    );
  }
}

const mapPropsFromStore = store => {
  return {
    app: store.switches
  }
};

export default connect(mapPropsFromStore)(Layer);
