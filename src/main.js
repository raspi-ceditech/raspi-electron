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
    contextIsolation: true,
    icon: __dirname + '/img/icono_raspi.png',
  });

  win.setMenu(null);
  win.maximize();
  //win.on('unmaximize', () => win.maximize());
  //win.setResizable(false);
  win.loadURL(url, { extraHeaders : 'pragma: no-cache\n' });
});