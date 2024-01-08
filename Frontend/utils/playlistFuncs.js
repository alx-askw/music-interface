const { config } = require('dotenv');
const { JsonDB, Config } = require('node-json-db');
const path = require('path');

const examplePath = './TESTPLAYLIST.json';
var db = new JsonDB(new Config(examplePath, true, false, '/'));


async function playlistRead() {
    //todo: pass through path from input box
    let data = await db.getData('/');
    console.log(data);
    return data;
}


async function playlistSave(playlist, path) {
    if (path.canceled === false) { //will only save if user clicks save
        try {
            const savePath = path.filePath.split('.')[0] + '.json'; //todo: how do people account for files names with . in them
            const saveDB = new JsonDB(new Config(savePath, true, false, '/'));
            let pushObject = {};
            playlist.forEach(async (element, index) => {
                pushObject[index] = element;
            });
            await saveDB.push('/', pushObject, true);
            return ({ status: 'success', message: 'Playlist Saved Successfully!' })
        } catch (e) {
            return ({ status: 'failure', message: `Playlist NOT Saved Successfully! Error ${e}` })
        }
    }
}



module.exports = {
    playlistRead,
    playlistSave
}