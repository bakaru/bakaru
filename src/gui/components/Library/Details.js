import Inferno from 'inferno'
import className from 'classnames'

export default function Details(props) {
  const openerClassName = className({
    'library-opener': true,
    'mod-visible': props.isShyLibrary
  })

  return (
    <div className="library-details">
      <div
        className={openerClassName}
        onClick={props.switchToLibrary}
      >
        <span>
          {'<<'} Back to library
        </span>
      </div>

      <button
        onClick={props.switchToPlayer}
      >
        Go to player
      </button>

      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
      I am details
    </div>
  );
}
