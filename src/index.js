'use strict';

const { app, BrowserWindow } = require('electron');

let win = null;

app.on('ready', () => {
  win = new BrowserWindow({
    contextIsolation: true,
    icon: __dirname + '/img/logo.png',
    //frame: false,
  });

  win.setMenu(null);
  win.maximize();
  //win.on('unmaximize', () => win.maximize());
  //win.setResizable(false);
  win.loadURL('http://127.0.0.1:8000/');
});


