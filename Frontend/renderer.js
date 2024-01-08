//renderer.js

//* This helps a lot with metadata :)
//https://javascript.info/file

//todo: look at attributes of mdn docs (like seeking event - very cool)
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio

//! Maybe clean these globals
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
  if (imagePath) {

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


function songChangeHandle(event) {
  console.log("change event", event.type, event.target.id)
  const invokeAction = event.type;
  console.log("invoke", invokeAction)
  switch (invokeAction) {
    case ('ended'):
      //! need to be careful, issues with the pointer going beyond the list size
      playlistPointer === (playlist.length - 1) ? playlistPointer = 0 : playlistPointer++;
      eventHandlersMP3();
      break;
    case ('click'):
      if (event.target.id === 'backBtn') {
        playlistPointer === 0 ? playlistPointer = (playlist.length - 1) : playlistPointer--;
        eventHandlersMP3();
      }
      if (event.target.id === 'forwardBtn') {
        playlistPointer === (playlist.length - 1) ? playlistPointer = 0 : playlistPointer++;
        eventHandlersMP3();
      }
      break;
    default:
      //Probably not this serious but it would be concerning
      alert('Somethings has gone terribly wrong!')
      break;
  }
}


async function eventHandlersMP3(event) {
  event = {
    target: {
      files: [
        {
          path: playlist[playlistPointer].song
        }
      ]
    }
  }
  console.log("event here: ", event)
  filePath = event.target.files[0].path;
  lyricPath = filePath.split(".")[0] + ".lrc";
  document.getElementById("audioPlayer").src = `file://${filePath}`;

  //*Adding and removing event listeners (remember that ELs aren't removed automatically)
  audioPlayer.removeEventListener("loadedmetadata", handleLoadedMetaData);
  audioPlayer.removeEventListener("timeupdate", handleTimeUpdates);
  document.getElementById("seekbar").removeEventListener("click", handleSeekbarClick);
  document.getElementById("lrcFile").removeEventListener("change", handleLrcChanges);


  audioPlayer.removeEventListener('ended', songChangeHandle);
  audioPlayer.addEventListener('ended', songChangeHandle);

  document.getElementById('backBtn').removeEventListener('click', songChangeHandle);
  document.getElementById('backBtn').addEventListener('click', songChangeHandle);

  document.getElementById('forwardBtn').removeEventListener('click', songChangeHandle);
  document.getElementById('forwardBtn').addEventListener('click', songChangeHandle);

  audioPlayer.addEventListener("loadedmetadata", handleLoadedMetaData);
  audioPlayer.addEventListener("timeupdate", handleTimeUpdates);
  document.getElementById("seekbar").addEventListener("click", handleSeekbarClick);
  document.getElementById("lrcFile").addEventListener("change", handleLrcChanges);


}

async function savePlaylist() {
  let playlistPaths = [];
  playlist.forEach((value) => {
    playlistPaths.push(value.song);
  })
  const plSave = await window.testAPI.playlistSave(playlistPaths);
  alert(plSave.message);
}


async function handleChanges(event) {
  console.log(event)
  // const fileType = event.target.files[0].name.split(".")[1];
  let getPath = await window.testAPI.openFile();
  let fileType = getPath.filePaths[0].split('.')[1];
  switch (fileType) {
    case ('mp3'):
      const filePath = getPath.filePaths[0];
      playlist.push({ song: filePath, index: playlist.length })
      break;

    case ('json'):
      console.log("json loaded");
      let loadedPlaylist = await window.testAPI.playlistRead(getPath.filePaths[0]);
      //todo: if multiple files are selected, handle the different types
      Object.keys(loadedPlaylist).forEach(async function async(key, index) {
        playlist.push({ song: loadedPlaylist[key], index: playlist.length })
      })
      break;

    default:
      alert('This program only accepts mp3/json');
      break;
  }

  //if just one song is loaded, it will load next on change event
  if (isNaN(audioPlayer.duration) | audioPlayer.ended) {
    eventHandlersMP3();
  }


  function uxPlaylistHandler() {
    const playlistULTag = document.getElementById('playlist');
    playlistULTag.innerHTML = '';
    playlist.forEach(function (song) {
      const songFromList = document.createTextNode(song.song);
      const entry = document.createElement('li');
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'removeButton';
      removeBtn.addEventListener('click', () => { playlist.splice(playlistPointer, 1); updatePlaylistIndices(); uxPlaylistHandler(); })

      const playBtn = document.createElement('button');
      playBtn.textContent = 'playButton';
      playBtn.addEventListener('click', () => { playlistPointer = song.index; eventHandlersMP3(event = { target: { files: [{ path: song.index }] } }) });

      console.log(playlist)

      entry.appendChild(songFromList)
      entry.appendChild(removeBtn);
      entry.appendChild(playBtn);
      playlistULTag.appendChild(entry);
    })
  }
  uxPlaylistHandler();

  document.getElementById('savePlaylist').addEventListener('click', savePlaylist);

}

// entry point into frontend event listeners
document.getElementById("mp3File").addEventListener("click", handleChanges);
document.getElementById('muteBtn').addEventListener('click', volumeControl);

document.getElementById('volumeSlider').addEventListener('click', handleVolumeSlider);
document.getElementById('volumeSliderFill').style.width = '100%';

//! Improve this playlist index fix
// On removing a song, this function is called to update the indices in the playlist
function updatePlaylistIndices() {
  for (let i = 0; i < playlist.length; i++) {
    playlist[i].index = i;
  }
}

window.testAPI.taskBarControls((control) => {
  //!Putting this in the mp3 handler caused a weird loop of sorts
  if (!isNaN(audioPlayer.duration) && control !== 'playPause') {
    songChangeHandle({ target: { id: control }, type: 'click' });
  } else if (!isNaN(audioPlayer.duration) && control === 'playPause') {
    audioPlayer.paused === false ? audioPlayer.pause() : audioPlayer.play()
  }
})