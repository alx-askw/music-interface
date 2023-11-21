// const express = require('express')
// const server = express()

// const { ipcMain } = require('electron');


// server.get('/', function (req, res) {
//     mainWindow.webContents.send('server-request', 'Server Req Text')
//     res.send('Hello World')
//     console.log("hello world")
// })

// // server.listen(3000)

// module.exports = server;

//server.js

const express = require('express');
const { ipcMain } = require('electron');

let currentSong = {
    title: 'No song playing',
    artist: 'No artist',
    duration: '00:00'
};


const startExpressServer = (window) => {
    const server = express();

    //todo: put routes in different file
    server.get('/', async function (req, res) {


        ipcMain.on('set-song', (event, song) => {
            currentSong = song;
        })
        await res.send(currentSong);
        // await console.log(currentSong);

        console.log('hello world');
    });


    server.listen(3000, () => {
        console.log('Express server is running on http://localhost:3000');
    });
};

module.exports = startExpressServer;
