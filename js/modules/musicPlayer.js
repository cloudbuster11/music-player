export {
  playPauseMedia,
  volumeControl,
  startTimer,
  nextPrevSongQueue,
};

const volumeEl = document.querySelector('.volume__display');
let currentTimeEl = document.querySelector('.tracktime__playing');

let totalTimeEl = document.querySelector('.tracktime__totaltime');
let totalPlayTime;
let timer = 0;

function playPauseMedia(isPlaying, musicPlayer, btnPlayPause) {
  if (!isPlaying) {
    isPlaying = true;
    musicPlayer.play();
    btnPlayPause.textContent = 'Pause';
    return isPlaying;
  } else if (isPlaying) {
    isPlaying = false;
    musicPlayer.pause();
    btnPlayPause.textContent = 'Play';
    return isPlaying;
  }
}

function nextPrevSongQueue(status, playingSongIndex) {
  if (status) {
    playingSongIndex++;
    console.log(playingSongIndex);
    return playingSongIndex;
  } else if (!status && playingSongIndex >= 1) {
    playingSongIndex--;
    console.log(playingSongIndex);
    return playingSongIndex;
  } else return playingSongIndex;
}

function volumeControl(e, musicPlayer) {
  if (e.target.classList.contains('btn-volumeup')) {
    if (musicPlayer.volume < 1.0) {
      musicPlayer.volume = musicPlayer.volume + 0.1;
      volumeEl.textContent = `${Math.floor(musicPlayer.volume * 10)}`;
    } else return;
  } else if (e.target.classList.contains('btn-volumedown')) {
    if (musicPlayer.volume > 0.01) {
      musicPlayer.volume = musicPlayer.volume - 0.1;
      volumeEl.textContent = `${Math.floor(musicPlayer.volume * 10)}`;
    } else return;
  }
}

function startTimer(musicPlayer) {
  timer = setInterval(() => {
    let currentPlayTime = Math.round(musicPlayer.currentTime);
    currentTimeEl.textContent = currentPlayTime;
  }, 1000);
  totalPlayTime = Math.round(musicPlayer.duration);
  totalTimeEl.textContent = totalPlayTime;
}
