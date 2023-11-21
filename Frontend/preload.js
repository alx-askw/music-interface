// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector, text) => {
//         const element = document.getElementById(selector)
//         if (element) element.innerText = text
//     }

//     for (const dependency of ['chrome', 'node', 'electron']) {
//         replaceText(`${dependency}-version`, process.versions[dependency])
//     }

// })

// preload.js

const { contextBridge, ipcRenderer } = require('electron');

const TESTAPI = {
    testMess: (message) => ipcRenderer.send('testMessage', message),
    printTest: (test) => console.log("here", test),
    printCurrentSong: (current) => console.log(`current song is: ${current}`),
    setCurrentSong: (song) => ipcRenderer.send('set-song', song)
}


contextBridge.exposeInMainWorld('testAPI', TESTAPI)

