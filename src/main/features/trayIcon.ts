import path from 'path';
import {BrowserWindow, app, Tray, Menu, nativeImage} from 'electron';
import {is} from "electron-util";

export default (window: BrowserWindow) => {
  const trayIcon = new Tray(nativeImage.createFromPath(path.join(app.getAppPath(), 'resources/icons/offline/16.png')));

  const handleIconClick = () => {
    if (window.isVisible() && window.isFocused()) {
<<<<<<< HEAD
      window.show()
      window.focus()
=======
      if (is.macos) {
        app.hide()
      } else {
        window.hide()
      }
>>>>>>> origin/master
    } else {
      window.show()
      window.focus()
    }
  }

  trayIcon.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Show',
      click: handleIconClick
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        // The running webpage can prevent the app from quiting via window.onbeforeunload handler
        // So lets use exit() instead of quit()
        app.exit()
      }
    }
  ]));

  trayIcon.setToolTip('Google Chat');

  return trayIcon;
}
