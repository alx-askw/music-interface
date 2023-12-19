
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain } = require('electron');
const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy


const chokidar = require('chokidar'); //https://www.npmjs.com/package/chokidar?activeTab=readme

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

async function updateImage(imgPath, mainWindow) {
    await mainWindow.webContents.send('update-image', imgPath)
}
//todo maybe have this func in a separate file
async function metaFunc(filePath, mainWindow) {
    // console.log(filePath, " in metafUnc")
    await NodeID3.read(filePath, function (err, output) {
        // if(output !== null){
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
        // }
        //todo: keep or remove? 
        // if (output.image && output.image.imageBuffer) {
        //     try {
        //         let binTest = Buffer.from(output.image.imageBuffer);
        //         let testImgData = new Blob([binTest.buffer], { type: 'image/png' })
        //         let testLink = URL.createObjectURL(testImgData);
        //         updateImage(testLink, mainWindow);
        //     } catch (e) {
        //         console.log("Error in metaFunc: ", e)
        //     }
        // }
    })
}


const startExpressServer = (mainWindow) => {
    const server = express();
    server.use(cors())

    //todo; add database creation here on start up

    // var db = new JsonDB(new Config("./userFiles/testDatabase", true, false, '/'));


    //! DO NOT PUT THIS LOGIC INSIDE THE ROUTE (MAKING A NEW EVENT PER GET REQ *facepalm*)
    ipcMain.handle('set-song', async (event, song) => {
        currentSong.currentPos = song.currentPos;
        currentSong.duration = song.duration;
        currentSong.currentLyric = song.currentLyric;
        // console.log("in ipcMain handle", song )
        await metaFunc(song.filePath, mainWindow);
    })

    //todo: keep of remove
    // const tempFilesDir = path.join(__dirname, 'tempFiles');
    // console.log("test", tempFilesDir)
    // chokidar.watch(tempFilesDir).on('all', (event, path) => {
    //     // let imgPath = path.join(__dirname, 'tempFiles', 'tempImage.jpg');
    //     updateImage(path);

    // })

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
