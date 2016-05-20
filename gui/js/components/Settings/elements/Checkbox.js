import React from 'react';

import classname from 'classnames';

export default function Checkbox (props) {
  const checkboxClass = classname({
    'fa fa-fw': true,
    'fa-square-o': !props.checked,
    'fa-check-square': props.checked
  });

  return (
    <checkbox>
      <i className={ checkboxClass }/>
    </checkbox>
  );
}
