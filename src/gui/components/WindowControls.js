import Inferno from 'inferno'
import Window from 'gui/control/Window'
import className from 'classnames'
import { connect } from 'inferno-redux'
import { library } from 'gui/store/modules/ui'

const iconMaximize = 'M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z';
const iconRestore = 'M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z';

const maximize = Window.maximize.bind(Window);
const unmaximize = Window.unmaximize.bind(Window);

function WindowControls(props) {
  const draggerClassName = className({
    'dragger': true,
    'mod-visible': props.ui.view === 'library'
  });

  const minMaxToggle = props.ui.maximized
    ? unmaximize
    : maximize;

  const minMaxTogglePath = props.ui.maximized
    ? iconRestore
    : iconMaximize;

  return (
    <div className={draggerClassName}>
      <header>
        カ Bakaru
      </header>
      <div className="wrapper">
        <button>
          <svg className="icon" x="0px" y="0px" viewBox="0 0 10.2 1">
            <rect width="10.2" height="2"/>
          </svg>
        </button>
        <button onClick={minMaxToggle}>
          <svg className="icon" x="0px" y="0px" viewBox="0 0 10.2 10.1">
            <path d={minMaxTogglePath}/>
          </svg>
        </button>
        <button
          onClick={() => window.close()}
        >
          <svg className="icon" x="0px" y="0px" viewBox="0 0 10.2 10.2">
            <polygon
              points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1 "
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default connect(
  state => ({
    ui: state.ui
  })
)(WindowControls);
