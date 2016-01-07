const register = (ipc, getMainWindow) => {
  ipc.on('rpc:minimizeMainWindow', (event, arg) => {
    getMainWindow().minimize();
  });
}


module.exports = register;
