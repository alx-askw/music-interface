//renderer.js

document.getElementById('mp3File').addEventListener('change', function (event) {
    const filePath = event.target.files[0].path;
    const imgPath = filePath.split(".")[0];
    document.getElementById('audioPlayer').src = `file://${filePath}`;
    document.getElementById('albumArt').src = `file://${imgPath}.jpg`
    window.testAPI.printCurrentSong(filePath);
    let aud = document.getElementById('audioPlayer')
    const audioInformation = {
        title: aud.duration
    }

    const metadata = new MediaMetadata({
        title: 'Jah Children Cry',
        artist: 'African Princess'
    })

    aud.addEventListener('loadedmetadata', () => {
        navigator.mediaSession.metadata = metadata
        let songDuration = (aud.duration / 60).toFixed(2)
        console.log("duration = ", songDuration)
        console.log("name = ", metadata.title)
        console.log("artist = ", metadata.artist)
        window.testAPI.setCurrentSong({
            title: 'Jah Children Cry ',
            artist: 'African Princess',
            duration: songDuration
        })
    })
});


// window.testAPI.printTest('hello hello from rend.js')