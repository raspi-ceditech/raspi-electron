#!/usr/bin/env bash
#ejecutame=sh -x ruta_absoluta_archivo
ruta=/var/log/raspi
sudo mkdir -p $ruta
sudo chmod 777 -R $ruta
exec 1>>$ruta/${​​​0##*/}​​​.log
exec 2>&1
date

if pulseaudio --check ; then
    pulseaudio --start
else
    pulseaudio -k
    pulseaudio --daemonize
fi