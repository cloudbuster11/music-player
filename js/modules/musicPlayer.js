export { playPauseMedia, volumeControl, startTimer };

const volumeEl = document.querySelector('.volume__display');
let currentTimeEl = document.querySelector('.tracktime__playing');

let totalTimeEl = document.querySelector('.tracktime__totaltime');
let totalPlayTime;
let timer = 0;

async function playPauseMedia(isPlaying, musicPlayer, btnPlayPause) {
  if (!isPlaying) {
    await musicPlayer.play();
    isPlaying = true;
    btnPlayPause.textContent = 'Pause';
    return isPlaying;
  } else if (isPlaying) {
    musicPlayer.pause();
    isPlaying = false;
    btnPlayPause.textContent = 'Play';
    return isPlaying;
  }
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
