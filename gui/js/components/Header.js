import React from 'react';
import BrowserWindow from 'utils/BrowserWindow';

import classname from 'classnames';

export default function Header({ actions, playerActive, focus }) {
  const headerClass = classname({
    hidden: focus !== 'library'
  });

  return (
    <header className={ headerClass }>
      <title>BAKARU バカル</title>
      <tabs>
        <tab onClick={ () => { actions.focusOnLibrary() } }>
          <i className="fa fa-reorder"></i> Library
        </tab>
        <tab onClick={ () => { actions.focusOnPlayer() } }>
          <i className="fa fa-tv"></i> Player
        </tab>
        <tab onClick={ () => { actions.focusOnSettings() } }>
          <i className="fa fa-wrench"></i> Settings
        </tab>
        <tab className="reload-tab" onClick={ () => window.location.reload() }>
          <i className="fa fa-refresh"></i> Reload app
        </tab>
      </tabs>
      <controls>
        <minimize onClick={ () => BrowserWindow.minimize() }>
          -
        </minimize>
        <exit dangerouslySetInnerHTML={{__html: '&times;'}} onClick={ () => window.close() }/>
      </controls>
    </header>
  );
}
