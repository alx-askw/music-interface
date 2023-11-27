//renderer.js

//* This helps a lot with metadata :)
//https://javascript.info/file

//todo: look at attributes of mdn docs (like seeking event - very cool)
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

document.getElementById('mp3File').addEventListener('change', function (event) {
    const filePath = event.target.files[0].path;
    const imgPath = filePath.split(".")[0];
    document.getElementById('audioPlayer').src = `file://${filePath}`;
    // document.getElementById('albumArt').src = `file://placeholder.jpg`
    let audioPlayer = document.getElementById('audioPlayer')


    const songObject = {
        filePath: 'no route',
        duration: '00:00',
        currentPos: '00:00'
    }
    audioPlayer.addEventListener('loadedmetadata', () => {
        let songDurationMins = Math.floor(Math.round(audioPlayer.duration) / 60);
        let songDurationSecs = Math.round(audioPlayer.duration) % 60;
        const formattedDuration = `${songDurationMins}:${songDurationSecs < 10 ? '0' : ''}${songDurationSecs}`;
        songObject.duration = formattedDuration;
        songObject.filePath = filePath;
        window.testAPI.setCurrentSong(songObject)



        //todo: move time calcs to separate file to reduce code smell 
        audioPlayer.addEventListener('timeupdate', (event) => {
            const currentTimeCall = audioPlayer.currentTime;
            const currentPosSecs = Math.round(currentTimeCall);
            const currentPosMins = Math.floor(currentPosSecs / 60);
            const currentPosSecsFormatted = currentPosSecs % 60;
            const formattedCurrentPos = `${currentPosMins}:${currentPosSecsFormatted < 10 ? '0' : ''}${currentPosSecsFormatted}`;


            songObject.currentPos = formattedCurrentPos;
            window.testAPI.setCurrentSong(songObject);
        })


    })

});

window.testAPI.sendForward((data) => {
    data.artPath !== ' ' ? document.getElementById('albumArt').src = data.artPath : document.getElementById('albumArt').src = ' ';
    console.log(data);
});
