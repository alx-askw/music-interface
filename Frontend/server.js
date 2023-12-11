
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain, ipcRenderer } = require('electron');
const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy
const path = require('path');
const fs = require('fs');

const { lyricObject } = require('./utils/lrcToLyricObject');

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

//todo maybe have this fun in a separate file
async function metaFunc(filePath, mainWindow) {
    await NodeID3.read(filePath, function (err, output) {
        currentSong.title = output.title;
        currentSong.artist = output.artist;

        fs.unlink('./tempFiles/tempImage.jpg', (err) => { if (err); })
        if (output.image && output.image.imageBuffer) {
            try {
                currentSong.imageBuffer = output.image.imageBuffer;
                tempAlbumArt = path.join(__dirname + '/' + 'tempFiles' + '/' + 'tempImage.jpg');
                fs.writeFileSync(tempAlbumArt, output.image.imageBuffer);
            } catch (e) {

                console.log(e)
            }
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
            console.log('error in ipc setlyric handler in server.js: ', err)
        }
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
