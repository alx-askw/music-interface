//main.js

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
// const server = require('./server')
const startExpressServer = require('./server');
const fs = require('fs');

require('dotenv').config()
const PORT = 3000;



let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

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
    //!Delete This
    // async function test() {
    //     console.log(await dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }))
    // }
    // test()
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

