
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain, ipcRenderer } = require('electron');
const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy
const { JsonDB, Config } = require('node-json-db');


const { lyricObject } = require('./utils/lrcToLyricObject');
const { storeImage } = require('./utils/storeCurrentImage');
const { songPersistence, checkSongLrc } = require('./utils/songDBFuncs.js');

const path = require('path');


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
let lastSong = '';

function isImageDirty(title, last) {
    // console.log(title, " | ", last)
    return (last === title);
}


//todo maybe have this func in a separate file
async function metaFunc(filePath, mainWindow) {
    await NodeID3.read(filePath, function (err, output) {
        currentSong.title = output.title;
        currentSong.artist = output.artist;
        if (!(isImageDirty(output.title, lastSong))) {
            storeImage(output, currentSong);
            tempAlbumArt = path.join(__dirname, 'tempFiles', 'tempImage.jpg')
            lastSong = currentSong.title;
        }
        // let testImage = fs.readFileSync('./exampleMusic/songComp.jpg')
        let testImage = output.comment.text;
        currentSong.imageBuffer = testImage;
        mainWindow.webContents.send('song-info', { artPath: tempAlbumArt, songInfo: currentSong });
        mainWindow.webContents.send('song-loaded', { songInfo: currentSong, artPath: tempAlbumArt });
    })
}


const startExpressServer = (mainWindow) => {
    const server = express();
    server.use(cors())

    //todo; add database creation here on start up

    // var db = new JsonDB(new Config("./userFiles/testDatabase", true, false, '/'));


    //! DO NOT PUT THIS LOGIC INSIDE THE ROUTE (MAKING A NEW EVENT PER GET REQ *facepalm*)
    ipcMain.on('set-song', (event, song) => {
        currentSong.currentPos = song.currentPos;
        currentSong.duration = song.duration;
        currentSong.currentLyric = song.currentLyric;
        metaFunc(song.filePath, mainWindow)

    })

    ipcMain.handle('set-lyric', async (event, loc) => {
        try {
            const lyrics = await lyricObject(loc);
            return lyrics;
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

    //todo: put routes in different file
    server.get('/', async function (req, res) {
        await res.send(currentSong);
    });


    server.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });
};

module.exports = startExpressServer;
