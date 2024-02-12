// preload.js

const e = require("cors");
const { contextBridge, ipcRenderer, ipcMain } = require("electron");



const TESTAPI = {
  // setCurrentSong: (song) => ipcRenderer.send('set-song', song),
  setCurrentSong: (song) => ipcRenderer.invoke("set-song", song),
  setCurrentSongMain: (song) => ipcRenderer.invoke("set-song-main", song),
  sendForward: (callback) =>
    ipcRenderer.on("song-loaded", (event, data) => {
      callback(data);
    }),
  updateImage: async () => {
    let imageUpdated = false; //Not super clean but this means that the 'artChange' function up front is only called once per image
    ipcRenderer.on('update-image', (event, imagePath) => {
      if (!imageUpdated) {
        document.getElementById('albumArt').src = imagePath;
        imageUpdated = true;
        ipcMain.invoke('img-link', imagePath);
      }
    })
  },
  lrcObject: async (loc) => {
    try {
      return await ipcRenderer.invoke("set-lyric", loc);
    } catch (err) {
      console.log("error in lrcObject invocation in preload.js: ", err);
      return null;
    }
  },
  addLrcToDB: (associateObj) => ipcRenderer.invoke("lrc-db", associateObj),
  lrcDBCheck: (song) => ipcRenderer.invoke("lrc-check", song),
  openFile: () => ipcRenderer.invoke('open-file'),
  playlistRead: (path) => ipcRenderer.invoke('pl-read', path),
  playlistSave: (playlist) => ipcRenderer.invoke('pl-save', playlist),
  taskBarControls: (callback) => ipcRenderer.on('task-bar-control', (_event, control) => callback(control)),
  displayInfo: (path) => ipcRenderer.invoke('dis-info', path)
};

contextBridge.exposeInMainWorld("testAPI", TESTAPI);
