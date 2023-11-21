//renderer.js

//* This helps a lot with metadata :)
//https://javascript.info/file

//todo: look at attributes of mdn docs (like seeking event - very cool)
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

document.getElementById('mp3File').addEventListener('change', function (event) {
    const filePath = event.target.files[0].path;
    const imgPath = filePath.split(".")[0];
    const fileMetaData = event.target.files[0];
    document.getElementById('audioPlayer').src = `file://${filePath}`;
    document.getElementById('albumArt').src = `file://${imgPath}.jpg`
    let audioPlayer = document.getElementById('audioPlayer')

    //todo: make this dynamic - find out where to get meta info from
    // const metadata = new MediaMetadata({
    //     title: fileMetaData.title,
    //     artist: fileMetaData.albumArtist !== "" ? fileMetaData.albumArtist : fileMetaData.contributingArtist
    // })

    const currentSong = {
        title: '',
        duration: '',
        currentPos: ''
    }
    audioPlayer.addEventListener('loadedmetadata', () => {
        let songDurationMins = Math.floor(Math.round(audioPlayer.duration) / 60);
        let songDurationSecs = Math.round(audioPlayer.duration) % 60;
        const formattedDuration = `${songDurationMins}:${songDurationSecs < 10 ? '0' : ''}${songDurationSecs}`;
        // const currentSong = {
        //     title: fileMetaData.name,
        //     duration: songDuration,
        //     currentPos: currentPosition
        // }
        currentSong.title = fileMetaData.name;
        currentSong.duration = formattedDuration;
        currentSong.currentPos = '00:00';
        window.testAPI.setCurrentSong(currentSong)
    })

    audioPlayer.addEventListener('timeupdate', (event) => {
        const currentTimeCall = audioPlayer.currentTime;
        const currentPosSecs = Math.round(currentTimeCall);
        const currentPosMins = Math.floor(currentPosSecs / 60);
        const currentPosSecsFormatted = currentPosSecs % 60;
        const formattedCurrentPos = `${currentPosMins}:${currentPosSecsFormatted < 10 ? '0' : ''}${currentPosSecsFormatted}`;
        currentSong.currentPos = formattedCurrentPos;

        window.testAPI.setCurrentSong(currentSong)

    })
});

