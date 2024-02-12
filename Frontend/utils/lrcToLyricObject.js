const fs = require('fs');

async function lyricObject(location) {
    try {
        const lrcRegex = /^(\[)(\d*)(:)(.*)(\])(.*)/i; //*Src: https://stackoverflow.com/questions/11510012/any-javascript-parser-for-lrc
        const lrcContent = await fs.promises.readFile(location, 'utf8');
        const lines = lrcContent.split('\n');
        const lyrics = lines.map(line => {
            const match = line.match(lrcRegex);
            if (match) {
                const minutes = parseInt(match[2]);
                const seconds = parseFloat(match[4]);
                const timestamp = minutes * 60 + seconds;
                const text = match[6];
                return { timestamp, text };
            }
            return null;
        }).filter(Boolean); //remove falsy (NaN, etc)
        return lyrics;
    } catch (err) {
        return null;
    }
}

module.exports = {
    lyricObject
};