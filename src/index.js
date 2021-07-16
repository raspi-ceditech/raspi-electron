'use strict';

const { app, BrowserWindow, Menu } = require('electron');
const child_process = require('child_process');
const path = require("path");
const windowLock = app.requestSingleInstanceLock();
const {getVersion} = require("./tareas")


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

    construirMenu(win);
    let comando_pulseaudio = "pulseaudio --check || pulseaudio --start"
    child_process.spawn(comando_pulseaudio, {
      encoding: 'utf8',
      shell: true
  });

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


function construirMenu(win){
  const temple = [
    {
      label:"Opciones", 
      submenu:[
        {
          label : "raSpi",
          click: function(){
            win.loadURL('http://127.0.0.1:8000/', { extraHeaders: 'pragma: no-cache\n' });
          }
        },
        {
          label : "Soporte",
          click: function(){
            win.loadFile(path.join(__dirname, '/soporte/views/index.html'));
          }
        }
      ]
    }

  ]
  const menu = Menu.buildFromTemplate(temple);
  Menu.setApplicationMenu(menu);
}