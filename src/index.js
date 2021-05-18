'use strict';

const { app, BrowserWindow } = require('electron');

let win = null;

/** Deshabilita la cache */
app.commandLine.appendSwitch('disable-http-cache');

/** Deshabilita el menú en las ventanas hijas de la principal */
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('ready', () => {
  win = new BrowserWindow({
    contextIsolation: true,
    title:'Raspi',
    icon: __dirname + '/img/icono_raspi.png',
    //frame: false,
  });

  win.setMenu(null);
  win.on('unmaximize', () => win.maximize());
  //win.setResizable(false);
  win.maximize();
  win.loadURL('http://127.0.0.1:8000/', { extraHeaders : 'pragma: no-cache\n' });
});