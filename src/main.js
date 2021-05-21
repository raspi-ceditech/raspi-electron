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
});