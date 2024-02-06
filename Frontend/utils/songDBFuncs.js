//* Once built the lrc associate file isn't created
//https://stackoverflow.com/questions/65033180/is-there-a-way-to-copy-or-create-a-folder-in-the-electron-app-package-root-direc
//https://www.electron.build/configuration/contents.html

const { JsonDB, Config } = require('node-json-db');
const path = require('path');

//*https://www.npmjs.com/package/node-json-db

const pathToDB = path.join(__dirname, '..', '..', 'userFiles', 'songObjects');

console.log("MAJOR !!!!!!!!!!", __dirname, " | ", pathToDB)

var db = new JsonDB(new Config(pathToDB, true, false, '/'));


const songPersistence = async (associateObj) => {
    await db.push(`/${associateObj.songName}`, `${associateObj.lrcPath}`)
};

const checkSongLrc = async (song) => {
    console.log(pathToDB)
    console.log(song)

    try {
        const data = await db.getData(song);
        const lrcLocation = data[song];
        console.log(lrcLocation, " | ", data)
        return lrcLocation
    } catch (err) {
        console.log(err)
        return null;
    }
};

module.exports = {
    songPersistence,
    checkSongLrc
}