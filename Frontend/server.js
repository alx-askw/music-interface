
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain } = require('electron');
const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy

const { lyricObject } = require('./utils/lrcToLyricObject');
const { songPersistence, checkSongLrc } = require('./utils/songDBFuncs.js');
const { getInfoForFrontendDisplay, metaFunc } = require('./utils/readFileFuncs.js');

//todo: add dirty system so the image buffer isn't sent every time
let currentSong = {
    title: 'No song playing',
    artist: 'No artist',
    duration: '00:00',
    currentPos: '00:00',
    imageBuffer: '',
    currentLyric: ' '
};

let tempAlbumArt = ' ';



const startExpressServer = (mainWindow) => {
    const server = express();
    server.use(cors())



    //! DO NOT PUT THIS LOGIC INSIDE THE ROUTE (MAKING A NEW EVENT PER GET REQ *facepalm*)
    ipcMain.handle('set-song', async (event, song) => {
        currentSong.currentPos = song.currentPos;
        currentSong.duration = song.duration;
        currentSong.currentLyric = song.currentLyric;
        await metaFunc(song.filePath, mainWindow, currentSong, tempAlbumArt);
    })


    ipcMain.handle('set-lyric', async (event, loc) => {
        try {
            return lyrics = await lyricObject(loc);
        } catch (err) {
            console.log('error in ipc set lyric handler in server.js: ', err)
        }
    })

    ipcMain.handle('lrc-db', (event, associateObj) => {
        songPersistence(associateObj);
    })

    ipcMain.handle('lrc-check', async (event, song) => {
        let check = await checkSongLrc(song);
        return check;
    })

    ipcMain.handle('dis-info', async (event, path) => {
        return await getInfoForFrontendDisplay(path);
    })

    //todo: put routes in different file
    server.get('/', async function (req, res) {
        await res.send(currentSong);
    });


    server.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });
};

module.exports = startExpressServer;
