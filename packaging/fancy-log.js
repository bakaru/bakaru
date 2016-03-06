'use strict';

const lu = require('log-update');
const es = require('elegant-spinner');

module.exports = function (text) {
  const frame = es();
  let interval = setInterval(() => {
    lu(`${text} ${frame()}`);
  }, 50);

  return () => {
    clearInterval(interval);
    lu(`${text} +`);
  };
};
