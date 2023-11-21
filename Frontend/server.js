
//server.js
const cors = require('cors');
const express = require('express');
const { ipcMain } = require('electron');

let currentSong = {
    title: 'No song playing',
    artist: 'No artist',
    duration: '00:00',
    currentPos: '00:00'
};


const startExpressServer = (window) => {
    const server = express();
    server.use(cors())

    //todo: put routes in different file
    server.get('/', async function (req, res) {
        ipcMain.on('set-song', (event, song) => {
            currentSong = song;
        })
        await res.send(currentSong);
    });

    server.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });
};

module.exports = startExpressServer;
