// preload.js

const { contextBridge, ipcRenderer } = require('electron');


const TESTAPI = {
    setCurrentSong: (song) => ipcRenderer.send('set-song', song),
    sendForward: (callback) => ipcRenderer.on('song-loaded', (event, data) => {
        callback(data)
    })
}


contextBridge.exposeInMainWorld('testAPI', TESTAPI)

