
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain } = require('electron');
const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy

const { lyricObject } = require('./utils/lrcToLyricObject');
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

async function updateImage(imgPath, mainWindow) {
    await mainWindow.webContents.send('update-image', imgPath)
}
//todo maybe have this func in a separate file
async function metaFunc(filePath, mainWindow) {
    // console.log(filePath, " in metafUnc")
    await NodeID3.read(filePath, function (err, output) {
        currentSong.title = output.title;
        currentSong.artist = output.artist;
        mainWindow.webContents.send('song-info', { artPath: tempAlbumArt, songInfo: currentSong });
        mainWindow.webContents.send('song-loaded', { songInfo: currentSong, artPath: tempAlbumArt });
        //todo: Move func to separate file
        if (output.image && output.image.imageBuffer) {
            try {
                //*Src:
                //https://stackoverflow.com/questions/20756042/how-to-display-an-image-stored-as-byte-array-in-html-javascript
                //https://stackoverflow.com/questions/6182315/how-can-i-do-base64-encoding-in-node-js
                let b64 = Buffer.from(output.image.imageBuffer).toString('base64')
                let link = `data:image/png;base64,${b64}`;
                updateImage(link, mainWindow)
            } catch (e) {
                console.log("Error in metaFunc: ", e)
            }
        }
    })
}


const startExpressServer = (mainWindow) => {
    const server = express();
    server.use(cors())



    //! DO NOT PUT THIS LOGIC INSIDE THE ROUTE (MAKING A NEW EVENT PER GET REQ *facepalm*)
    ipcMain.handle('set-song', async (event, song) => {
        currentSong.currentPos = song.currentPos;
        currentSong.duration = song.duration;
        currentSong.currentLyric = song.currentLyric;
        // console.log("in ipcMain handle", song )
        await metaFunc(song.filePath, mainWindow);
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

    //todo: put routes in different file
    server.get('/', async function (req, res) {
        await res.send(currentSong);
    });


    server.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });
};

module.exports = startExpressServer;
