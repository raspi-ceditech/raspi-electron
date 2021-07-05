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
          comando = "";
          ejecutar_comando()
        } else {
          console.log(`Download failed: ${state}`)
        }
      });
    });
  });
});







function ejecutar_comando(comando, callback) {
  var child = child_process.spawn(comando, {
      encoding: 'utf8',
      shell: true
  });

  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (data) => {
      //Here is the output
      data = data.toString();
      logger("electron captura stdout= \n" + data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (data) => {
      logger("electron captura stderr= \n" + data);
  });

  child.on('close', (code) => {
      //Here you can get the exit code of the script  
      switch (code) {
          case 0:
              if (typeof callback === 'function') {
                  logger("log callback= "+callback.toString());
                  callback();
              }
              break;
          default:
              dialog.showMessageBox({
                  title: 'Fallo actualizacion',
                  type: 'warning',
                  message: 'Ocurrio un error en la actualizacion\nse grabaron los reportes\r\n'
              });
              break;
      }

  });
}
