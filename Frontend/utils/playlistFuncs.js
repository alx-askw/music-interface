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


module.exports = {
    playlistRead
}