"use strict";

const {ipcRenderer, contextBridge} = require("electron");

const validChannels = ["reiniciar"];
const validChannelsRTA = validChannels.map(ch =>{
    return ch+"_rta"
});

contextBridge.exposeInMainWorld("api",
{
    send: (channel, data) => {
        
        // whitelist channels
        
        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
        }
    },
    receive: (channel, func) => {
        
        
        if (validChannelsRTA.includes(channel)) {
            // Deliberately strip event as it includes `sender` 
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
}
);