import path from 'path';
import {app, BrowserWindow} from 'electron';

// Need to fix the paths before loading any other library
// https://github.com/electron/electron/issues/23854
import fixPathsForSnap from './features/fixPathsForSnap';

fixPathsForSnap();

import reportExceptions from './features/reportExceptions';
import windowWrapper from './windowWrapper';
import {enforceSingleInstance, restoreFirstInstance} from './features/singleInstance';
import environment from "../environment";
import enableContextMenu from './features/contextMenu';
import runAtLogin from './features/openAtLogin';
import updateNotifier from './features/appUpdates';
import setupTrayIcon from './features/trayIcon';
import keepWindowState from './features/windowState';
import externalLinks from './features/externalLinks';
import badgeIcons from './features/badgeIcon';
import closeToTray from './features/closeToTray';
import setAppMenu from './features/appMenu';
import overrideUserAgent from './features/userAgent';
//remove check online
//import setupOfflineHandlers, {checkForInternet} from './features/inOnline';
import logFirstLaunch from './features/firstLaunch';
import handleNotification from './features/handleNotification';
import {enforceMacOSAppLocation} from "electron-util";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;
let trayIcon = null;
const fs = require('fs');

// Features
app.commandLine.appendSwitch('disk-cache-size', String(300 * 1024 * 1024));
reportExceptions();

if (enforceSingleInstance()) {
  app.whenReady()
    .then(() => {
      overrideUserAgent();
      mainWindow = windowWrapper(environment.appUrl);
      //setupOfflineHandlers(mainWindow);
      //checkForInternet(mainWindow);

      trayIcon = setupTrayIcon(mainWindow);
      logFirstLaunch();
      setAppMenu(mainWindow);
      restoreFirstInstance(mainWindow);
      keepWindowState(mainWindow);
      runAtLogin(mainWindow);
      updateNotifier();
      enableContextMenu();
      badgeIcons(mainWindow, trayIcon);
      closeToTray(mainWindow);
      externalLinks(mainWindow);
      handleNotification(mainWindow);
      // mainWindow.webContents.on('dom-ready', () => {        
      //   const customScriptUrl = fs.readFileSync(path.join(app.getAppPath(), 'resources/js/customScript.js'), 'utf8');
      //   mainWindow.webContents.executeJavaScript(customScriptUrl, true);
      // })
      //enforceMacOSAppLocation()
    })
}

app.on('window-all-closed', () => {
  app.exit();
});

app.on('activate', () => {
  if (mainWindow) {
    mainWindow.show();
  }
});
