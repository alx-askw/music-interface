//main.js

const { app, BrowserWindow, ipcMain } = require('electron');
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
            click() { console.log('thumbar button 1 pressed') },
            tooltip: 'Test Btn 1'
        },
        {
            icon: null,
            click() { console.log('thumbar button 2 pressed') },
            tooltip: 'Test Btn 2'
        }

    ])

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // console.log("here", mainWindow.webContents);
}
const albumArtPath = './tempFiles/tempImage.jpg';
app.whenReady().then(() => {
    createWindow();
    if (fs.existsSync(albumArtPath)) fs.unlink(albumArtPath, (err) => { if (err) console.log(err); });
    startExpressServer(mainWindow);
});

app.on('window-all-closed', function () {
    // ipc.removeAllListeners('set-song'); //!investigate this ASAP - see kanban board
    fs.unlink('./tempFiles/tempImage.jpg', (err) => { if (err) console.log(err); })
    if (process.platform !== 'darwin') app.quit();

});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});


ipcMain.on('testAPI', (event, args) => {
    console.log(args)
})

