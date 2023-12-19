const fs = require('fs');
const path = require('path');

const tempFilesDir = path.join(__dirname, '..', 'tempFiles');

let tempAlbumArt = ' ';

//todo; bugged - no image is displaying in the frontend
function storeImage(output, currentSong) {
    if (!fs.existsSync(tempFilesDir)) {
        fs.mkdirSync(path.join(tempFilesDir));
    }
    // fs.unlink('../tempFiles/tempImage.jpg', (err) => { if (err); })
    fs.unlink(path.join(__dirname, '..', 'tempFiles', 'tempImage.jpg'), (err) => { if (err); })

    if (output.image && output.image.imageBuffer) {
        try {
            currentSong.imageBuffer = output.image.imageBuffer;
            tempAlbumArt = path.join(__dirname, '..', 'tempFiles', 'tempImage.jpg'); //https://stackoverflow.com/questions/30845416/how-to-go-back-1-folder-level-with-dirname
            // console.log(tempAlbumArt)
            fs.writeFileSync(tempAlbumArt, output.image.imageBuffer);
        } catch (e) {
            // console.log("Error in storeCurrentImage: ", e)
        }
    }
}

module.exports = {
    storeImage
}