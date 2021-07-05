'use strict';

const { app, BrowserWindow } = require('electron');
const child_process = require('child_process');
const url = process.argv.pop()
const fs = require('fs');

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

    win.webContents.session.on('will-download', (event, item, webContents) => {

      console.log("tamaño total= "+item.getTotalBytes());
      // Set the save path, making Electron not to prompt a save dialog.
      let nombre_archivo='/tmp/'+item.getFilename(); 
      item.setSavePath(nombre_archivo);

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
          let comando = "/opt/Citrix/ICAClient/wfica "+nombre_archivo;
          console.log("tamaño total en ejecutar= "+item.getTotalBytes());
          
          ejecutar_comando(comando, null);
        } else {
          console.log(`Download failed: ${state}`)
        }
      });
    });
  });






function logger(err){
  let newDate = new Date(Date.now());
  const log = `${newDate.toDateString()} ${newDate.toTimeString()}`+"\n"+err+"\n";
  fs.appendFileSync('/var/log/raspi/electron_main_citrix.log', log);
}


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

      }
  });
}
