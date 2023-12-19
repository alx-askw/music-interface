// preload.js

const e = require('cors');
const { contextBridge, ipcRenderer } = require('electron');


const TESTAPI = {
    // setCurrentSong: (song) => ipcRenderer.send('set-song', song),
    setCurrentSong: (song) => ipcRenderer.invoke('set-song', song),
    sendForward: (callback) => ipcRenderer.on('song-loaded', (event, data) => {
        callback(data)
    }),
    lrcObject: async (loc) => {
        try {
            return await ipcRenderer.invoke('set-lyric', loc)
        } catch (err) {
            console.log('error in lrcObject invocation in preload.js: ', err)
            return null;
        }
    },
    addLrcToDB: (associateObj) => ipcRenderer.invoke('lrc-db', associateObj),
    lrcDBCheck: (song) => ipcRenderer.invoke('lrc-check', song)
}


contextBridge.exposeInMainWorld('testAPI', TESTAPI)

