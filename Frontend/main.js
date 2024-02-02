//main.js

const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron');
const path = require('path');
const { playlistSave, playlistRead } = require('./utils/playlistFuncs.js');
const startExpressServer = require('./server');
const fs = require('fs');

//! FOR SOME REASON TRYING TO BUILD WITH SQUIRREL.WINDOWS, THIS LINE CAUSES A HUGE PROBLEM - I COMMENTED THIS OUT IN TEST BUILD 1
require('dotenv').config()
//!^^^^^^^^^^^^^^^^^^^^^^^^
const PORT = 3000;


//https://www.electronjs.org/docs/latest/tutorial/dark-mode
nativeTheme.themeSource = 'dark';

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            // devTools: false,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.setResizable(false); //todo: make app responsive

    mainWindow.setThumbarButtons([
        {
            icon: null,
            click() { mainWindow.webContents.send('task-bar-control', 'backBtn') },
            tooltip: 'Last Song'
        },
        {
            icon: null,
            click() { mainWindow.webContents.send('task-bar-control', 'playPause') },
            tooltip: 'Play or Pause'
        },
        {
            icon: null,
            click() { mainWindow.webContents.send('task-bar-control', 'forwardBtn') },
            tooltip: 'Next Song'
        }

    ])

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
    startExpressServer(mainWindow);
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});


ipcMain.on('testAPI', (event, args) => {
    console.log(args)
})


ipcMain.handle('open-file', async () => {
    // let readPath = await dialog.showOpenDialog({ filters: [{ name: 'MP3 Files', extensions: ['mp3'] }, { name: 'JSON Files', extensions: ['json'] }] });
    let readPath = await dialog.showOpenDialog();
    return readPath;
})

ipcMain.handle('pl-read', async (event, path) => {
    let test = await playlistRead(path);
    return test;
})

ipcMain.handle('pl-save', async (event, playlist) => {
    try {
        let savePath = await dialog.showSaveDialog();
        return await playlistSave(playlist, savePath);
    } catch (e) {
        return ({ status: 'failure', message: `Playlist NOT Saved Successfully! Error ${e}` })

    }
})

