const NodeID3 = require('node-id3'); //! don't import whole thing? this library is heavy


async function metaFunc(filePath, mainWindow, currentSong, tempAlbumArt) {
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
                (async () => await mainWindow.webContents.send('update-image', link))();
            } catch (e) {
                console.log("Error in metaFunc: ", e)
            }
        }
    })
}


const tempUndefinedCheck = (string) => {
    const stringSplit = string.split('-');
}

async function getInfoForFrontendDisplay(path) {
    return new Promise((resolve, reject) => {
        let returnObj = { artist: '', songName: '' };
        NodeID3.read(path, function (err, output) {
            returnObj.artist = output.artist && output.artist.trim !== '' ? output.artist : ''; // if either field is empty
            returnObj.songName = output.title && output.title.trim !== '' ? output.title : '';
            resolve(returnObj);
        })
    })
    // return { artist: " ", songName: "" }
}



module.exports = {
    metaFunc,
    getInfoForFrontendDisplay

}