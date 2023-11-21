//main.js

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
// const server = require('./server')
const startExpressServer = require('./server');

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

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // console.log("here", mainWindow.webContents);
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

