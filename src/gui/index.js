// import 'font-awesome/css/font-awesome.css';
// import 'styles/font.css';
// import 'styles/main.scss';

import socketIO from 'socket.io-client';

const io = socketIO(`http://127.0.0.1:${getQueryVariable('port')}`);

import React, {PropTypes} from 'react';
import useSheet from 'react-jss';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import Granim from 'granim';

// const wcjs = window.require(getQueryVariable('wcjsPath'));

window.bgGradient = new Granim({
  element: '#bg-gradient',
  name: 'basic-gradient',
  direction: 'left-right',
  opacity: [.2, .2],
  isPausedWhenNotInView: true,
  states : {
    "default-state": {
      gradients: [
        ['#AA076B', '#61045F'],
        ['#02AAB0', '#00CDAC'],
        ['#DA22FF', '#9733EE']
      ]
    }
  }
});

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const cats = [];
    const categories = new Map([
      ['A', [
        'Awesome cool header here',
        'Awesome cool header here',
        'Awesome cool header here',
        'Awesome cool header here',
        'Awesome cool header here',
        'Awesome cool header here',
        'Awesome cool header here',
        'Awesome cool header here',
      ]],
      ['B', [
        'Blazingly cool header here',
        'Blazingly cool header here',
        'Blazingly cool header here',
        'Blazingly cool header here',
        'Blazingly cool header here',
        'Blazingly cool header here',
        'Blazingly cool header here',
        'Blazingly cool header here',
      ]],
      ['C', [
        'Coolie cool header here',
        'Coolie cool header here',
        'Coolie cool header here',
        'Coolie cool header here',
        'Coolie cool header here',
        'Coolie cool header here',
        'Coolie cool header here',
        'Coolie cool header here',
      ]],
      ['D', [
        'Dang cool header here',
        'Dang cool header here',
        'Dang cool header here',
        'Dang cool header here',
        'Dang cool header here',
        'Dang cool header here',
        'Dang cool header here',
        'Dang cool header here',
      ]],
      ['E', [
        'Euphoric cool header here',
        'Euphoric cool header here',
        'Euphoric cool header here',
        'Euphoric cool header here',
        'Euphoric cool header here',
        'Euphoric cool header here',
        'Euphoric cool header here',
        'Euphoric cool header here',
      ]]
    ]);

    for (const [name, entries] of categories) {
      const cat = [];

      entries.map((entry, index) => {
        cat.push(
          <entry key={`${entry}--${index}`}>
            <header>
              {entry}
            </header>
            <info>
              {Math.random()}
            </info>
          </entry>
        );
      });

      cats.push(
        <div key={name}>
          <category>{name}</category>
          {cat}
        </div>
      );
    }

    //  className={this.props.sheet.classes.wrapper}

    return (
      <wrapper>
        <gui>
          <library>
            {cats}
          </library>
        </gui>
      </wrapper>
    );
  }
}

const styles = {
  wrapper: {
    background: 'red'
  }
};

const WrappedInStyles = useSheet(Wrapper, styles);

ReactDom.render(
  <Wrapper/>,
  document.getElementById('gui-mount')
);

function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}
