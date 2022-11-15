import { getToken, searchSong } from './modules/api.js';
import {
  displaySearchResults,
  removeSearchResults,
  displaySelectedSongDetails,
  displayQueue,
} from './modules/display.js';

const searchResultEl = document.querySelector('.search__result');
const inputField = document.querySelector('.searchbar__inputfield');
const btnSearch = document.querySelector('.btn__search');
const btnPlayPause = document.querySelector('.btn__playpause');
const musicPlayer = document.querySelector('.music_player');
const musicPlayerSrc = document.querySelector('source');

const volumeEl = document.querySelector('.volume__display');
const mediaPlayerCont = document.querySelector(
  '.mediaplayer__container'
);
let currentTimeEl = document.querySelector('.tracktime__playing');
let totalTimeEl = document.querySelector('.tracktime__totaltime');

let currentPlayTime;
let totalPlayTime;
let timer = 0;
let isPlaying = false;
let searchResult = [];
let inputSearchField = '';

let queueList = [];

volumeEl.textContent = `${Math.floor(musicPlayer.volume * 10)}`;

// Sökfältet
btnSearch.addEventListener('click', async () => {
  removeSearchResults(searchResult);
  await getToken();
  inputSearchField = inputField.value;
  searchResult = await searchSong(inputSearchField);
  displaySearchResults(searchResult, searchResultEl);
});

// Play/Pause Mediaplayer
btnPlayPause.addEventListener('click', () => {
  playPauseMedia();
});

// Starta låt från sökresultat eller queue.
document.addEventListener('click', function (e) {
  playSongFromList(e);
});

// Volym (Ska slås ihop med play/pause eventlistner med hjälp av bubbling event senare.)
mediaPlayerCont.addEventListener('click', (e) => {
  volumeControl(e);
});

async function playSongFromList(e) {
  if (e.target.classList.contains('btn__playsong')) {
    let songId = e.target.dataset['id'];
    displaySelectedSongDetails(songId, searchResult);
    musicPlayerSrc.src = searchResult[songId].preview_url;
    musicPlayer.load();
    await musicPlayer.play();
    totalPlayTime = Math.round(musicPlayer.duration);
    totalTimeEl.textContent = totalPlayTime;
    startTimer();
    btnPlayPause.textContent = 'Pause';
    isPlaying = true;
  } else if (e.target.classList.contains('btn__queuesong')) {
    addToQueue(e.target.dataset['id']);
  }
}

function playPauseMedia() {
  if (!isPlaying) {
    musicPlayer.play();
    isPlaying = true;
    btnPlayPause.textContent = 'Pause';
  } else if (isPlaying) {
    musicPlayer.pause();
    isPlaying = false;
    btnPlayPause.textContent = 'Play';
  }
}

// Måste hitta annan lösning på nedan
let queueIndex = 0;

function addToQueue(songIndex) {
  console.log(songIndex);
  queueList.push(searchResult[songIndex]);
  displayQueue(queueIndex, queueList);
  queueIndex++;
  return;
}

function volumeControl(e) {
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

function updateTimer() {
  currentPlayTime = Math.round(musicPlayer.currentTime);
  currentTimeEl.textContent = currentPlayTime;
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}
