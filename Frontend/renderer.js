//renderer.js

//* This helps a lot with metadata :)
//https://javascript.info/file

//todo: look at attributes of mdn docs (like seeking event - very cool)
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

//! I dislike how these global variables are set out
const audioPlayer = document.getElementById("audioPlayer");

let lyrics;
const songObject = {
  filePath: "no route",
  duration: "00:00",
  currentPos: "00:00",
  currentLyric: " ",
};
let songDurationSecs = 0;
let currentPosSecs = 0;
let tempDurationSecs = 0;
let formattedCurrentPos = "0:00";

let lyricPath = "";
let filePath = "";

let imagePath = '';


let playlist = [];

let playlistPointer = 0;

async function handleLoadedMetaData(event) {
  tempDurationSecs = document.getElementById("audioPlayer").duration;
  let songDurationMins = Math.floor(Math.round(audioPlayer.duration) / 60);

  const formattedDuration = `${songDurationMins}:${songDurationSecs < 10 ? "0" : ""
    }${songDurationSecs}`;
  songObject.duration = formattedDuration;
  songObject.filePath = filePath;
  songObject.currentPos = formattedCurrentPos;

  lyrics = await window.testAPI.lrcObject(lyricPath);
  if (lyrics === null) {
    let check = await window.testAPI.lrcDBCheck(filePath);
    if (check !== null) {
      lyrics = await window.testAPI.lrcObject(check);
    }
  }


  imagePath = await window.testAPI.updateImage();
  // console.log("image path in renderer: ", imagePath);
  if (imagePath) {
    // document.getElementById('albumArt').src = imagePath;
  }
}

async function handleTimeUpdates(event) {
  const currentTimeCall = audioPlayer.currentTime;
  currentPosSecs = Math.round(currentTimeCall);
  const currentPosMins = Math.floor(currentPosSecs / 60);
  const currentPosSecsFormatted = currentPosSecs % 60;
  formattedCurrentPos = `${currentPosMins}:${currentPosSecsFormatted < 10 ? "0" : ""
    }${currentPosSecsFormatted}`;
  songObject.currentPos = formattedCurrentPos;

  //*Colouring in seekbar
  let songPercent = (currentPosSecs / tempDurationSecs) * 100;
  document.getElementById("seekbarFill").style.width = songPercent + "%";

  const currentTime = audioPlayer.currentTime;
  if (lyrics !== null) {
    const currentLyric = lyrics.find(
      (lyric) =>
        lyric.timestamp <= currentTime && currentTime < lyric.timestamp + 1
    );
    if (currentLyric) {
      document.getElementById("lyrics").innerText = currentLyric.text;
      songObject.currentLyric = currentLyric.text;
    }
  }
  window.testAPI.setCurrentSong(songObject);
}

async function handleSeekbarClick(event) {
  //https://stackoverflow.com/questions/3234256/find-mouse-position-relative-to-element
  //https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
  let seekDomRect = document.getElementById("seekbar").getBoundingClientRect();
  // console.log(seekDomRect);
  let percent = (event.clientX - seekDomRect.left) / seekDomRect.width;
  audioPlayer.currentTime = percent * audioPlayer.duration;

  //todo: add time/duration numbers to seekbar so it can be seen visually
}

async function handleLrcChanges(event) {
  const lrcPath = event.target.files[0].path;
  let songName = filePath;
  const associateObj = { lrcPath, songName };
  let addLyric = await window.testAPI.addLrcToDB(associateObj);

  //!This logic is used twice - not good code -
  //todo: package into it's own function to clean code
  lyrics = await window.testAPI.lrcObject(lyricPath);
  if (lyrics === null) {
    let check = await window.testAPI.lrcDBCheck(filePath);
    if (check !== null) {
      lyrics = await window.testAPI.lrcObject(check);
    }
  }
}


function volumeControl() {
  //Default Vol is 1.0
  //https://www.w3schools.com/tags/av_prop_volume.asp

  let volume = audioPlayer.muted;
  const muteButton = document.getElementById('muteBtn');
  volume !== true ? audioPlayer.muted = true : audioPlayer.muted = false;
  muteButton.style.backgroundColor = audioPlayer.muted ? 'grey' : 'green';
};

function handleVolumeSlider(event) {
  let volDomObj = document.getElementById('volumeSlider').getBoundingClientRect();
  let percent = (event.clientX - volDomObj.left) / volDomObj.width;
  audioPlayer.volume = percent;
  document.getElementById('volumeSliderFill').style.width = `${percent * 100}%`;
  console.log(audioPlayer.volume);
};


async function eventHandlersMP3(event) {
  console.log("event here: ", event)
  filePath = event.target.files[0].path;
  lyricPath = filePath.split(".")[0] + ".lrc";
  document.getElementById("audioPlayer").src = `file://${filePath}`;

  //*Adding and removing event listeners (remember that ELs aren't removed automatically)
  audioPlayer.removeEventListener("loadedmetadata", handleLoadedMetaData);
  audioPlayer.removeEventListener("timeupdate", handleTimeUpdates);
  document.getElementById("seekbar").removeEventListener("click", handleSeekbarClick);
  document.getElementById("lrcFile").removeEventListener("change", handleLrcChanges);

  audioPlayer.addEventListener("loadedmetadata", handleLoadedMetaData);
  audioPlayer.addEventListener("timeupdate", handleTimeUpdates);
  document.getElementById("seekbar").addEventListener("click", handleSeekbarClick);
  document.getElementById("lrcFile").addEventListener("change", handleLrcChanges);

}


async function handleChanges(event) {

  playlist = [];
  playlistPointer = 0;

  const fileType = event.target.files[0].name.split(".")[1];
  switch (fileType) {
    case ('mp3'):

      break;

    case ('json'):
      console.log("json loaded");
      let plTets = await window.testAPI.playlistRead('t');
      const list = document.getElementById('playList');
      const fileInput = document.getElementById('mp3File');
      Object.keys(plTets).forEach(async function async(key, index) {

        // filePath = plTets[key];
        // lyrics = filePath.split(".")[0] + ".lrc";
        // document.getElementById("audioPlayer").src = `file://${filePath}`;
        playlist.push(plTets[key])

      })
      // alert(playlist[0])


      break;

    default:
      alert('This program only accepts mp3/json');
      break;
  }
}

// entry point into frontend event listeners
document.getElementById("mp3File").addEventListener("change", handleChanges);
document.getElementById('muteBtn').addEventListener('click', volumeControl);

document.getElementById('volumeSlider').addEventListener('click', handleVolumeSlider);
document.getElementById('volumeSliderFill').style.width = '100%';

