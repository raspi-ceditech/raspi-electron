'use strict';
const fs = require('fs')
const { app, BrowserWindow } = require('electron');
const path = require("path");
const windowLock = app.requestSingleInstanceLock();
require("./tareas")


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

    let version = getVersion();

    win = new BrowserWindow({
      title: 'Raspi V'+version,
      icon: __dirname + '/img/icono_raspi.png',
      //frame: false,
      webPreferences: {
        nodeIntegration:false,
        contextIsolation: true,
        enableRemoteModule:false,
        preload: path.join(__dirname, 'preload.js')
      },
      minWidth:800,
      minHeight:540,
    });


    win.setMenu(null);
    win.on('unmaximize', () => win.maximize());
    //win.setResizable(false);
    win.maximize();
    win.loadURL('http://127.0.0.1:8000/', { extraHeaders: 'pragma: no-cache\n' });

    /* Set did-fail-load listener once */
    win.webContents.on("did-fail-load", function() {
      win.loadFile(path.join(__dirname, '/mensaje_error.html'));
    });
  });
}




function getVersion() {
  const data = fs.readFileSync('/var/www/html/raspi/util/actualizacion/version.txt', 'utf8');
  return data
}