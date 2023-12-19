// //renderer.js

// //* This helps a lot with metadata :)
// //https://javascript.info/file

// //todo: look at attributes of mdn docs (like seeking event - very cool)
// // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

// document.getElementById('mp3File').addEventListener('change', async function (event) {
//     const filePath = event.target.files[0].path;
//     const lyricPath = filePath.split(".")[0] + '.lrc';
//     document.getElementById('audioPlayer').src = `file://${filePath}`;
//     const audioPlayer = document.getElementById('audioPlayer')

//     let lyrics;
    

//     const songObject = {
//         filePath: 'no route',
//         duration: '00:00',
//         currentPos: '00:00',
//         currentLyric: ' '
//     }
//     let songDurationSecs = 0;
//     let currentPosSecs = 0;
//     let tempDurationSecs = 0;
//     audioPlayer.addEventListener('loadedmetadata', async () => {
//         let songDurationMins = Math.floor(Math.round(audioPlayer.duration) / 60);
//         songDurationSecs = Math.round(audioPlayer.duration) % 60;
//         tempDurationSecs = document.getElementById('audioPlayer').duration;
//         const formattedDuration = `${songDurationMins}:${songDurationSecs < 10 ? '0' : ''}${songDurationSecs}`;
//         songObject.duration = formattedDuration;
//         songObject.filePath = filePath;
//         window.testAPI.setCurrentSong(songObject)


//         document.getElementById('test').innerText = 'coming soon';

//         lyrics = await window.testAPI.lrcObject(lyricPath);
//         if (lyrics === null) {
//             let check = await window.testAPI.lrcDBCheck(filePath);
//             console.log("here 1", check)
//             if (check !== null) {
//                 lyrics = await window.testAPI.lrcObject(check);
//                 console.log("here 2", lyrics)

//             }
//         }
//         console.log("right under lyrics grabber" ,lyrics)

//         window.testAPI.sendForward((data) => {
//             data.artPath !== ' ' ? document.getElementById('albumArt').src = data.artPath : document.getElementById('albumArt').src = ' ';
//         });

//         //todo: move time calcs to separate file to reduce code smell 
//         audioPlayer.addEventListener('timeupdate', (event) => {
//             const currentTimeCall = audioPlayer.currentTime;
//             currentPosSecs = Math.round(currentTimeCall);
//             const currentPosMins = Math.floor(currentPosSecs / 60);
//             const currentPosSecsFormatted = currentPosSecs % 60;
//             const formattedCurrentPos = `${currentPosMins}:${currentPosSecsFormatted < 10 ? '0' : ''}${currentPosSecsFormatted}`;


//             songObject.currentPos = formattedCurrentPos;
//             window.testAPI.setCurrentSong(songObject);

//             //*Colouring in seekbar
//             let songPercent = (currentPosSecs / tempDurationSecs) * 100;
//             document.getElementById('seekbarFill').style.width = songPercent + '%';
//         })

//         //https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
//         //https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
//         document.getElementById('seekbar').addEventListener('click', (event) => {
//             let seekDomRect = document.getElementById('seekbar').getBoundingClientRect();
//             // console.log(seekDomRect);
//             let percent = (event.clientX - seekDomRect.left) / seekDomRect.width;
//             audioPlayer.currentTime = percent * audioPlayer.duration;

//             //todo: add time/duration numbers to seekbar so it can be seen visually

//         })


//     })

//     audioPlayer.addEventListener('timeupdate', (event) => {
//         console.log("lyric array: ", lyrics)
//         const currentTime = audioPlayer.currentTime;
//         const currentLyric = lyrics.find(lyric => lyric.timestamp <= currentTime && currentTime < lyric.timestamp + 1);
//         if (currentLyric) {
//             document.getElementById('lyrics').innerText = currentLyric.text;
//             songObject.currentLyric = currentLyric.text;
//         }

//     })


//     document.getElementById('lrcFile').addEventListener('change', async function (event) {
//         const lrcPath = event.target.files[0].path;
//         let songName = filePath;
//         const associateObj = { lrcPath, songName };
//         let addLyric = await window.testAPI.addLrcToDB(associateObj)
//         // lyrics = await window.testAPI.
//     })


// });




const audioPlayer = document.getElementById('audioPlayer')

let lyrics;
const songObject = {
    filePath: 'no route',
    duration: '00:00',
    currentPos: '00:00',
    currentLyric: ' '
}
let songDurationSecs = 0;
let currentPosSecs = 0;
let tempDurationSecs = 0;

let lyricPath = '';

async function handleLoadedMetaData(event) {
    tempDurationSecs = document.getElementById('audioPlayer').duration;


    lyrics = await window.testAPI.lrcObject(lyricPath);
    if (lyrics === null) {
        let check = await window.testAPI.lrcDBCheck(filePath);
        if (check !== null) {
            lyrics = await window.testAPI.lrcObject(check);

        }
    }


}

async function handleTimeUpdates(event){

    const currentTimeCall = audioPlayer.currentTime;
    currentPosSecs = Math.round(currentTimeCall);
    const currentPosMins = Math.floor(currentPosSecs / 60);
    const currentPosSecsFormatted = currentPosSecs % 60;
    const formattedCurrentPos = `${currentPosMins}:${currentPosSecsFormatted < 10 ? '0' : ''}${currentPosSecsFormatted}`;

    //*Colouring in seekbar
    let songPercent = (currentPosSecs / tempDurationSecs) * 100;
    document.getElementById('seekbarFill').style.width = songPercent + '%';

        const currentTime = audioPlayer.currentTime;
        const currentLyric = lyrics.find(lyric => lyric.timestamp <= currentTime && currentTime < lyric.timestamp + 1);
        if (currentLyric) {
            document.getElementById('lyrics').innerText = currentLyric.text;
            songObject.currentLyric = currentLyric.text;
        }

}

async function handleSeekbarClick(event){
        document.getElementById('seekbar').addEventListener('click', (event) => {
            let seekDomRect = document.getElementById('seekbar').getBoundingClientRect();
            // console.log(seekDomRect);
            let percent = (event.clientX - seekDomRect.left) / seekDomRect.width;
            audioPlayer.currentTime = percent * audioPlayer.duration;

            //todo: add time/duration numbers to seekbar so it can be seen visually

        })
}

async function handleChanges (event){
    const filePath = event.target.files[0].path;
    lyricPath = filePath.split(".")[0] + '.lrc';
    document.getElementById('audioPlayer').src = `file://${filePath}`;

    //*Adding and removing event listeners (remember that ELs aren't removed automatically)
    audioPlayer.removeEventListener('loadedmetadata', handleLoadedMetaData);
    audioPlayer.removeEventListener('timeupdate', handleTimeUpdates);
    document.getElementById('seekbar').removeEventListener('click', handleSeekbarClick);

    audioPlayer.addEventListener('loadedmetadata', handleLoadedMetaData);
    audioPlayer.addEventListener('timeupdate', handleTimeUpdates);
    document.getElementById('seekbar').addEventListener('click', handleSeekbarClick);

}

// entry point into frontend event listeners
document.getElementById('mp3File').addEventListener('change', handleChanges);
    

