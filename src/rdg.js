'use strict';

const { app, BrowserWindow } = require('electron');
const cp = require('child_process');

const url = process.argv.pop()

let win = null;

/** Deshabilita la cache */
app.commandLine.appendSwitch('disable-http-cache');

/** Deshabilita el menú en las ventanas hijas de la principal */
app.on('browser-window-created', function (e, window) {
  window.setMenu(null);
});

app.on('ready', () => {

  poner_resolucion_rendimiento();

  win = new BrowserWindow({
    title: 'RD Gateway',
    icon: __dirname + '/img/microsoft_icon.png',
    //frame: false,
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

app.on('window-all-closed', () => {
  poner_resolucion();
  app.quit()
})


function poner_resolucion_rendimiento() {
  code = cp.spawnSync('xrandr --output HDMI-1 --mode 800x600');
}

function poner_resolucion_original(){
  code = cp.spawnSync('xrandr --output HDMI-1 --mode 1024x768');
}