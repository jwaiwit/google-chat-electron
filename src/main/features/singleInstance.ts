import {app, BrowserWindow} from 'electron';
import log from 'electron-log';

const enforceSingleInstance = (): boolean => {
  const gotTheLock = app.requestSingleInstanceLock();

  if (!gotTheLock) {
    console.info('Force exit from second instance');
    app.exit();
  }

  return gotTheLock;
}

const restoreFirstInstance = (window: BrowserWindow) => {
  app.on('second-instance', () => {
    if (app.commandLine.hasSwitch('relaunch')) {
      log.debug("App relaunched on snap pre-refresh hook")
      app.relaunch();
      app.exit();
    }
    // Someone tried to run a second instance, we should focus our window.
    if (window) {
      if (window.isMinimized()) {
        window.restore()
      }
      window.show()
    }
  })
}

export {restoreFirstInstance, enforceSingleInstance}
