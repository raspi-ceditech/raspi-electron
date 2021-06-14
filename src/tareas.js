
"use strict";
//Dependencias necesitadas por tareas.js
const { app, ipcMain, dialog } = require('electron');
const child_process = require('child_process');

//RUTAS
const ruta_raspi = "/var/www/html/raspi"
const ruta_actualizacion = ruta_raspi + "/util/actualizacion/"


module.exports = {

    forzar_actualizacion: ipcMain.on("reiniciar", (event, arg) => {
        reiniciar(event, function () {
            event.reply("reiniciar_rta", "termine");
        });
    }),

}



function reiniciar(event, callback) {
    ejecutar_comando("sh /var/www/html/raspi/util/actualizacion/atualizaciones/run_server.sh",
    setTimeout(reload,3000))
        
}


function reload(){
    app.relaunch()
    app.exit()
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
        console.log("electron captura stdout= \n" + data);
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        console.log("electron captura stderr= \n" + data);
    });

    child.on('close', (code) => {
        //Here you can get the exit code of the script  
        switch (code) {
            case 0:
                if (typeof callback === 'function') {
                    
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