import {ipcMain, app, nativeImage, BrowserWindow, Tray} from 'electron';
import path from 'path';

let iconTicking = 0; 
let blinkIconTimer = 0;
let currentState:string = '';
type IconTypes = 'offline' | 'normal' | 'badge';

// Decide app icon based on favicon URL
const decideIcon = (href: string): IconTypes => {
  let type: IconTypes = 'offline';

  if (href.match(/favicon_chat_r2/) || href.match(/favicon_chat_new_non_notif_r2/)) {
    type = 'normal';
  } else if (href.match(/favicon_chat_new_notif_r2/)) {
    type = 'badge';
  }

  iconTicking = 0;
  currentState = type;
  return type;
}

const blinkIcon = (trayIcon: Tray) => {  
	if(currentState == "badge") {      
			iconTicking++
			if (iconTicking % 2) {				
        setTray(trayIcon, 'normal');
			}
			else {				
        setTray(trayIcon, currentState);
			}
	}
  else {
    setTray(trayIcon, 'normal');
  }
};

const setTray = (trayIcon: Tray, state: string) => {
  
  let icon = nativeImage.createFromPath(path.join(app.getAppPath(), `resources/icons/${state}/256.png`)) 
  trayIcon.setImage(icon);
  //console.log(path.join(app.getAppPath(), `resources/icons/${state}/256.png`))
  //console.log(icon)
}

export default (window: BrowserWindow, trayIcon: Tray) => {

  ipcMain.on('faviconChanged', (evt, href) => {
    
    const type = decideIcon(String(href));
    //console.log(href + "->>>>>>>>>>>>>" + type)
    if (type == 'badge') {
      if (!blinkIconTimer) {
        blinkIconTimer = setInterval(blinkIcon, 500, trayIcon); 
      }
    }
    else{
      if (blinkIconTimer) {
        clearInterval(blinkIconTimer);
        blinkIconTimer = 0;      
      }
      
      let icon = nativeImage.createFromPath(path.join(app.getAppPath(), `resources/icons/${type}/256.png`))
      setTray(trayIcon, type);
      window.setIcon(icon);  
    } 
  });

  ipcMain.on('unreadCount', (event, count: number) => {
    app.setBadgeCount(Number(count))
  });
}
