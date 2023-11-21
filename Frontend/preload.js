// preload.js

const { contextBridge, ipcRenderer } = require('electron');


const TESTAPI = {
    setCurrentSong: (song) => ipcRenderer.send('set-song', song),
}


contextBridge.exposeInMainWorld('testAPI', TESTAPI)

