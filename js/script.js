import { getToken, searchSong } from './modules/api.js';
import {
  displaySearchResults,
  removeSearchResults,
  displaySelectedSongDetails,
  displayQueue,
  removeFromQueue,
  toggleActiveSongClass,
} from './modules/display.js';
import {
  playPauseMedia,
  volumeControl,
  startTimer,
  nextPrevSongQueue,
} from './modules/musicPlayer.js';

const searchResultEl = document.querySelector('.search__result');
const inputField = document.querySelector('.searchbar__inputfield');
const btnSearch = document.querySelector('.btn__search');
const btnPlayPause = document.querySelector('.btn__playpause');
const musicPlayer = document.querySelector('.music_player');
const musicPlayerSrc = document.querySelector('source');

const mediaPlayerCont = document.querySelector(
  '.mediaplayer__container'
);

let isPlaying = false;
let searchResult = [];
let inputSearchField = '';
let queueList = [];
let playingSongIndex;

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
  isPlaying = playPauseMedia(isPlaying, musicPlayer, btnPlayPause);
});

// Starta låt från sökresultat eller queue.
document.addEventListener('click', function (e) {
  let songId = e.target.dataset['id'];
  if (e.target.classList.contains('btn__removequeue')) {
    removeFromQueue(songId, queueList);
  } else if (e.target.classList.contains('btn__playsong')) {
    playSongFromList(songId);
  } else if (e.target.classList.contains('btn__queuesong')) {
    addToQueue(songId);
  } else if (
    e.target.classList.contains('btn__next') ||
    e.target.classList.contains('btn__prev')
  ) {
    if (e.target.classList.contains('btn__next')) {
      let songId = nextPrevSongQueue(true, playingSongIndex);
      playSongFromQueue(songId);
    } else if (e.target.classList.contains('btn__prev')) {
      let songId = nextPrevSongQueue(false, playingSongIndex);
      playSongFromQueue(songId);
    }
  }
});

// Volym (Ska slås ihop med play/pause eventlistner med hjälp av bubbling event senare.)
mediaPlayerCont.addEventListener('click', (e) => {
  volumeControl(e, musicPlayer);
});

function playSongFromList(songId) {
  queueList.unshift(searchResult[songId]);
  playingSongIndex = 0;
  displaySelectedSongDetails(songId, searchResult);
  displayQueue(queueList, playingSongIndex);
  toggleActiveSongClass(playingSongIndex);
  musicPlayerSrc.src = queueList[0].preview_url;
  // toggleActiveSongClass(playingSongIndex);
  // musicPlayerSrc.src = searchResult[songId].preview_url;
  musicPlayer.load();
  isPlaying = playPauseMedia(false, musicPlayer, btnPlayPause);
  startTimer(musicPlayer);
}

function playSongFromQueue(songId) {
  playingSongIndex = songId;
  displaySelectedSongDetails(songId, queueList);
  displayQueue(queueList, playingSongIndex);
  musicPlayerSrc.src = queueList[songId].preview_url;
  // toggleActiveSongClass(playingSongIndex);
  musicPlayer.load();
  isPlaying = playPauseMedia(false, musicPlayer, btnPlayPause);
  toggleActiveSongClass(playingSongIndex);
  startTimer(musicPlayer);
}

function addToQueue(songIndex) {
  // console.log(songIndex);
  queueList.push(searchResult[songIndex]);
  displayQueue(queueList);
  toggleActiveSongClass(playingSongIndex);
  return;
}
