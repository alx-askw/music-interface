//main.js

const { app, BrowserWindow, ipcMain, dialog, nativeTheme } = require('electron');
const path = require('path');
const { playlistSave, playlistRead } = require('./utils/playlistFuncs.js');
const startExpressServer = require('./server');

const DiscordRPC = require('discord-rpc');

// const isPackaged = app.isPackaged;
//! FOR SOME REASON TRYING TO BUILD WITH SQUIRREL.WINDOWS, THIS LINE CAUSES A HUGE PROBLEM - I COMMENTED THIS OUT IN TEST BUILD 1
// require('dotenv').config()
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
            // sandbox: !isPackaged
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
})


ipcMain.handle('open-file', async () => {
    let readPath = await dialog.showOpenDialog();
    return readPath;
})

ipcMain.handle('pl-read', async (event, path) => {
    let readPlaylist = await playlistRead(path);
    return readPlaylist;
})

ipcMain.handle('pl-save', async (event, playlist) => {
    try {
        let savePath = await dialog.showSaveDialog();
        return await playlistSave(playlist, savePath);
    } catch (e) {
        return ({ status: 'failure', message: `Playlist NOT Saved Successfully! Error ${e}` })

    }
})


//Discord Rich Presence 
//todo maybe move this to its own file
//########################################################

//Example code used to make this work:
//https://github.com/discordjs/RPC/blob/master/example/main.js


const lyricCleaner = require('./utils/lyricContent.js')
const SFWLyrics = true; // todo

//todo: artist or title could be undefined - need to handle that 
//! Song duration seconds aren't being accounted for somewhere
let currentSong = {
    title: 'No song playing',
    artist: 'No artist',
    duration: '00:00',
    currentPos: '00:00',
    imageBuffer: '',
    currentLyric: 'No Lyrics'
};

const { metaFunc } = require('./utils/readFileFuncs.js');
let tempAlbumArt = ' ';
ipcMain.handle('set-song-main', async (event, song) => {
    currentSong.currentPos = song.currentPos;
    currentSong.duration = song.duration;
    // if (SFWLyrics){
    currentSong.currentLyric = song.currentLyric.length > 2 ? song.currentLyric : "------"; //rpc.setActivity fields must be more than 2 characters 
    //}
    await metaFunc(song.filePath, mainWindow, currentSong, tempAlbumArt);
})

//! Images have to be uploaded manually to discord dev portal :(
// ipcMain.handle('img-link', async (event, imageLink) => {
//     currentSong.imageBuffer = imageLink;
// })

const clientId = null;

if (clientId !== null) {
    console.log("Client ID Present");
    const rpc = new DiscordRPC.Client({ transport: 'ipc' });

    async function setActivity() {
        if (!rpc || !mainWindow) {
            return;
        }

        rpc.setActivity({
            name: '// Dionysos Music Player //',
            details: `${currentSong.artist} - ${currentSong.title} | ${currentSong.currentPos} / ${currentSong.duration}`,
            state: `${currentSong.currentLyric}`,
            url: 'https://github.com/alx-askw/music-interface',
            instance: false,
        });
    }

    rpc.on('ready', () => {
        setActivity();
        setInterval(() => {
            setActivity();
        }, 1000); //! This should only work every 15 seconds according to example code + docs but setting to 1 second works (be careful)
    });

    rpc.login({ clientId }).catch(console.error);
}