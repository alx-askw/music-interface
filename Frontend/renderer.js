//renderer.js

//* This helps a lot with metadata :)
//https://javascript.info/file

//todo: look at attributes of mdn docs (like seeking event - very cool)
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

document.getElementById('mp3File').addEventListener('change', function (event) {
    const filePath = event.target.files[0].path;
    const imgPath = filePath.split(".")[0];
    document.getElementById('audioPlayer').src = `file://${filePath}`;
    let audioPlayer = document.getElementById('audioPlayer')


    const songObject = {
        filePath: 'no route',
        duration: '00:00',
        currentPos: '00:00',
        currentLyric: ' '
    }
    audioPlayer.addEventListener('loadedmetadata', () => {
        let songDurationMins = Math.floor(Math.round(audioPlayer.duration) / 60);
        let songDurationSecs = Math.round(audioPlayer.duration) % 60;
        const formattedDuration = `${songDurationMins}:${songDurationSecs < 10 ? '0' : ''}${songDurationSecs}`;
        songObject.duration = formattedDuration;
        songObject.filePath = filePath;
        window.testAPI.setCurrentSong(songObject)

        window.testAPI.sendForward((data) => {
            data.artPath !== ' ' ? document.getElementById('albumArt').src = data.artPath : document.getElementById('albumArt').src = ' ';
            // console.log(data);
        });

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

    const lyrics = [
        { timestamp: 10.47, text: 'Always ends the same' },
        { timestamp: 13.22, text: 'When it was me and you' },
        { timestamp: 15.89, text: 'But everytime I need somebody new' },
        { timestamp: 19.13, text: "It's like Deja Vu" },
        { timestamp: 21.65, text: 'I swear they sound the same' },
        { timestamp: 24.54, text: "It's like they know my skin" },
        {
            timestamp: 27.48,
            text: 'Every word they say sounds just like him'
        },
        { timestamp: 30.53, text: 'And it goes like this' },
        { timestamp: 33.43, text: "We'll get in your car" },
        { timestamp: 35.14, text: "And you'll lean to kiss me" },
        { timestamp: 36.7, text: "We'll talk for hours" },
        { timestamp: 37.88, text: 'And lie on the back seat' },
        { timestamp: 39.97, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 43.22, text: 'Uh huh, uh huh' },
        { timestamp: 44.43, text: 'And then one random night' },
        { timestamp: 46.22, text: 'When everything changes' },
        { timestamp: 47.71, text: "You won't reply" },
        { timestamp: 49.09, text: "And we'll go back to strangers" },
        { timestamp: 51.31, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 54.13, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 57.09, text: '♪' },
        { timestamp: 67.08, text: 'Something that I hate' },
        { timestamp: 69.55, text: "How everyone's disposable" },
        { timestamp: 72.52, text: 'Every time I date somebody knew' },
        { timestamp: 75.43, text: 'I feel vulnerable' },
        { timestamp: 78.28, text: 'That it will never change' },
        { timestamp: 80.9, text: 'And it will just stay like this' },
        { timestamp: 83.8, text: 'Never ending day in breaking up' },
        { timestamp: 87.03, text: 'And it goes like this' },
        { timestamp: 89.96000000000001, text: "We'll get in your car" },
        { timestamp: 91.36, text: "And you'll lean to kiss me" },
        { timestamp: 93.19, text: "We'll talk for hours" },
        { timestamp: 94.22, text: 'And lie on the back seat' },
        { timestamp: 96.58, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 99.58, text: 'Uh huh, uh huh' },
        { timestamp: 101.16, text: 'And then one random night' },
        { timestamp: 102.63, text: 'When everything changes' },
        { timestamp: 104.33, text: "You won't reply" },
        { timestamp: 105.34, text: "And we'll go back to strangers" },
        { timestamp: 108.17, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 110.95, text: 'Uh huh, uh huh' },
        { timestamp: 112.28999999999999, text: 'It always ends the same' },
        { timestamp: 114.68, text: 'When it was me and you' },
        { timestamp: 117.53, text: 'But every time I meet somebody new' },
        { timestamp: 120.86, text: "It's like Deja Vu" },
        { timestamp: 122.8, text: 'And when we spoke for months' },
        { timestamp: 125.57, text: 'What did you ever mean?' },
        { timestamp: 127.68, text: '(What did you ever mean?)' },
        { timestamp: 129.01, text: 'How can they say that this is love?' },
        { timestamp: 132.07, text: 'And it goes like this' },
        { timestamp: 134.91, text: "We'll get in your car" },
        { timestamp: 136.46, text: "And you'll lean to kiss me" },
        { timestamp: 138.04, text: "We'll talk for hours" },
        { timestamp: 139.35, text: 'And lie on the back seat' },
        { timestamp: 141.87, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 144.87, text: 'Uh huh, uh huh' },
        { timestamp: 146.34, text: 'And then one random night' },
        { timestamp: 147.97, text: 'When everything changes' },
        { timestamp: 149.67000000000002, text: "You won't reply" },
        { timestamp: 150.88, text: "And we'll go back to strangers" },
        { timestamp: 153.53, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 155.93, text: 'Uh huh, uh huh, uh huh' },
        { timestamp: 157.81, text: '♪' },
        { timestamp: 167.69, text: 'Go back to strangers' },
        { timestamp: 171.06, text: '' }
    ]

    audioPlayer.addEventListener('timeupdate', (event) => {
        const currentTime = audioPlayer.currentTime;
        const currentLyric = lyrics.find(lyric => lyric.timestamp <= currentTime && currentTime < lyric.timestamp + 1);
        if (currentLyric) {
            document.getElementById('lyrics').innerText = currentLyric.text;
            songObject.currentLyric = currentLyric.text;
        }
    })

});



