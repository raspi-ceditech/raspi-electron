"use strict";

const btnclick_forzar_actualizacion = document.getElementById('forzar_actualizacion');

btnclick_forzar_actualizacion.addEventListener('click',function(){
    
    btnclick_forzar_actualizacion.disabled=true;
    window.api.send("forzar_actualizacion");

    const imagen = document.getElementById("imagen");
    imagen.classList.add("rotar");
});

window.api.receive("forzar_actualizacion_rta", (data) => {
    
    btnclick_forzar_actualizacion.disabled=false;
    imagen.classList.remove("rotar");
    console.log(data);
});



const version = document.getElementById("version");
window.api.receive("get_version_rta", (data) => {
    version.innerHTML = data;
});
window.api.send("get_version");
