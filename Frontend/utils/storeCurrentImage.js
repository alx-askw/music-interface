
const fs = require('fs');
const path = require('path');


// const { updateImage } = require("..server.js");
// console.log(__dirname, '..', "server.js")
const tempFilesDir = path.join(__dirname, '..', 'tempFiles');

let tempAlbumArt = ' ';

//todo; bugged - no image is displaying in the frontend
function storeImage(output, currentSong) {
    if (!fs.existsSync(tempFilesDir)) {
        fs.mkdirSync(path.join(tempFilesDir));
    }

    fs.unlink(path.join(__dirname, '..', 'tempFiles', 'tempImage.jpg'), (err) => { if (err) console.log("error in store image", err); })
    // console.log("in image write")
    if (output.image && output.image.imageBuffer) {
        try {
            currentSong.imageBuffer = output.image.imageBuffer;
            tempAlbumArt = path.join(__dirname, '..', 'tempFiles', 'tempImage.jpg'); //https://stackoverflow.com/questions/30845416/how-to-go-back-1-folder-level-with-dirname
            fs.writeFileSync(tempAlbumArt, output.image.imageBuffer);
        } catch (e) {
            console.log("Error in storeCurrentImage: ", e)
        }
    }
}





module.exports = {
    storeImage
}