
"use strict";
//Dependencias necesitadas por tareas.js
const { app, ipcMain, dialog } = require('electron');
const child_process = require('child_process');
const fs = require('fs');

//RUTAS
const ruta_raspi = "/var/www/html/raspi"
const ruta_actualizacion = ruta_raspi + "/util/actualizacion/"


module.exports = {

    reiniciar: ipcMain.on("reiniciar", (event, arg) => {
        reiniciar(event, function () {
            event.reply("reiniciar_rta", "termine");
        });
    }),
    forzar_actualizacion: ipcMain.on("forzar_actualizacion", (event, arg) => {
        forzar_actualizacion(event, function () {
            event.reply("forzar_actualizacion_rta", "termine");
        });
    }),

    get_version: ipcMain.on("get_version", (event, arg) => {
        event.reply("get_version_rta", version());
    }),

    getVersion: () => {
        return version();
    },
}

function forzar_actualizacion(event, callback) {
    ejecutar_matar_python(
        ejecutar_git_reset(
            ejecutar_rm_version(
                ejecutar_actualizacion(callback))));
}

function ejecutar_matar_python(callback) {
    let comando = `killall python3`
    ejecutar_comando(comando, callback);
}

function ejecutar_rm_version(callback) {
    let comando = `cd ${ruta_actualizacion} && rm -f version.txt`
    ejecutar_comando(comando, callback);
}

function ejecutar_git_reset(callback) {
    let comando = `cd ${ruta_raspi} && git reset --hard`
    ejecutar_comando(comando, callback);

}


function version() {
    let data;
    try{
        data = fs.readFileSync('/var/www/html/raspi/util/actualizacion/version.txt', 'utf8');
    }catch (err){
        if (err.code == 'ENOENT'){
            data = " version no detectada";
        }else{
            data = " error desconocido";
            logger(err.toString());
        }
    }
    return data;
}


function logger(err){
    let newDate = new Date(Date.now());
    const log = `${newDate.toDateString()} ${newDate.toTimeString()}`+"\n"+err+"\n";
    fs.appendFile('/var/log/raspi/electron.log', log, (err)=>{
        if (err){
            throw err;
        } 
    });    
}


function reiniciar(event, callback) {
    ejecutar_comando("sh /var/www/html/raspi/util/actualizacion/atualizaciones/run_server.sh",
        setTimeout(reload, 3000))

}


function reload() {
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


function ejecutar_actualizacion(callback){
    let comando = `cd ${ruta_actualizacion} && python3`

    var child = child_process.spawn(comando, [ruta_actualizacion+"actualizacion.py"], {
        encoding: 'utf8',
        shell: true
    });
    //cuando falla el programa
    child.on('error', (error) => {
        
        dialog.showMessageBox({
            title: 'Forzar actualizacion',
            type: 'warning',
            message: 'No se pudo actualizar forzosamente.\r\n'
        });
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (data) => {
        //Here is the output
        data=data.toString();   
        logger("electron captura stdout= \n"+data);      
    });

    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (data) => {
        logger("electron captura stderr= \n"+data);
    });

    child.on('close', (code) => {
        //Here you can get the exit code of the script  
        switch (code) {
            case 0:
                dialog.showMessageBox({
                    title: 'Actualizacion Terminada',
                    type: 'none',
                    message: 'La actualizacion forzosa termino, reinicie, para aplicar cambios\r\n'
                });
                break;
            default:
                dialog.showMessageBox({
                    title: 'Fallo actualizacion',
                    type: 'warning',
                    message: 'Ocurrio un error en la actualizacion\nse grabaron los reportes\r\n'
                });
                break;
        }
        if (typeof callback === 'function'){
            callback();
        }
    });

}