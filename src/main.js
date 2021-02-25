'use strict';

const { app, BrowserWindow } = require('electron');

const url = process.argv.pop()

let win = null;

app.on('ready', () => {
  win = new BrowserWindow({
    contextIsolation: true,
  });

  win.setMenu(null);
  win.maximize();
  //win.on('unmaximize', () => win.maximize());
  //win.setResizable(false);
  win.loadURL(url);
});