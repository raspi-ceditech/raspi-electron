'use strict';

const { app, BrowserWindow } = require('electron');
const windowLock = app.requestSingleInstanceLock();

let win = null;

/** Se encarga que exista una sola ventana */
if (!windowLock) {
  app.quit();
} else {

  /** Trae la ventana que ya esta abierta, no vuelva a crear una instancia de la misma */
  app.on('second-instance', (event, CommandLine, workingDirectory) => {
    if (win) {
      if (win.isMinimized()) {
        win.restore();
      }
    }
  });


  /** Deshabilita la cache */
  app.commandLine.appendSwitch('disable-http-cache');

  /** Deshabilita el menú en las ventanas hijas de la principal */
  app.on('browser-window-created', function (e, window) {
    window.setMenu(null);
  });

  app.on('ready', () => {
    win = new BrowserWindow({
      title: 'Raspi',
      icon: __dirname + '/img/icono_raspi.png',
      //frame: false,
      webPreferences: {
        contextIsolation: true,
      },
    });

    win.setMenu(null);
    win.on('unmaximize', () => win.maximize());
    //win.setResizable(false);
    win.maximize();
    win.loadURL('http://127.0.0.1:8000/', { extraHeaders: 'pragma: no-cache\n' });
  });

}