
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain, ipcRenderer } = require('electron');
const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy
const path = require('path');
const fs = require('fs');

let currentSong = {
    title: 'No song playing',
    artist: 'No artist',
    duration: '00:00',
    currentPos: '00:00'
};

let tempAlbumArt = '';

//todo maybe have this fun in a separate file
async function metaFunc(filePath, mainWindow) {
    await NodeID3.read(filePath, function (err, output) {
        currentSong.title = output.title;
        currentSong.artist = output.artist;

        if (output.image && output.image.imageBuffer) {
            try {
                tempAlbumArt = path.join(__dirname + '/' + 'tempFiles' + '/' + 'tempImage.jpg');
                fs.writeFileSync(tempAlbumArt, output.image.imageBuffer);
            } catch (e) {

                console.log(e)
            }
        }
        // mainWindow.webContents.send('song-info', { artPath: tempAlbumArt, songInfo: currentSong });
        mainWindow.webContents.send('song-loaded', { songInfo: currentSong, artPath: tempAlbumArt });
    })
}


const startExpressServer = (mainWindow) => {
    const server = express();
    server.use(cors())
    //! DO NOT PUT THIS LOGIC INSIDE THE ROUTE (MAKING A NEW EVENT PER GET REQ *facepalm*)
    ipcMain.on('set-song', (event, song) => {
        currentSong.currentPos = song.currentPos;
        currentSong.duration = song.duration;
        metaFunc(song.filePath, mainWindow)

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
