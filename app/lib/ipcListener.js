import { main, renderer } from 'lib/events';

export default (ipc, getMainWindow) => {
  ipc.on(main.minimizeMainWindow, (event, arg) => {
    getMainWindow().minimize();
  });
}
