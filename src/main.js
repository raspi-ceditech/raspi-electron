'use strict';

const { app, BrowserWindow } = require('electron');

const url = process.argv.pop()

let win = null;


app.commandLine.appendSwitch('disable-http-cache');

app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('ready', () => {
  win = new BrowserWindow({
    title: 'WebApps',
    icon: __dirname + '/img/icono_raspi.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  win.setMenu(null);
  win.maximize();
  win.loadURL(url, { extraHeaders: 'pragma: no-cache\n' });

  win.webContents.on('did-finish-load', () => {

    win.webContents.session.on('will-download', (event, item, webContents) => {
      // Set the save path, making Electron not to prompt a save dialog.
      item.setSavePath('/tmp/save.ica');

      item.on('updated', (event, state) => {
        if (state === 'interrupted') {
          console.log('Download is interrupted but can be resumed')
        } else if (state === 'progressing') {
          if (item.isPaused()) {
            console.log('Download is paused')
          } else {
            console.log(`Received bytes: ${item.getReceivedBytes()}`)
          }
        }
      });
      item.once('done', (event, state) => {
        if (state === 'completed') {
          console.log('Download successfully')
        } else {
          console.log(`Download failed: ${state}`)
        }
      });
    });
  });
});