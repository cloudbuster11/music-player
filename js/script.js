import { getToken, searchSong } from './modules/api.js';
import {
  displaySearchResults,
  removeSearchResults,
  displaySelectedSongDetails,
  displayQueue,
  removeFromQueue,
} from './modules/display.js';
import {
  playPauseMedia,
  volumeControl,
  startTimer,
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
  if (e.target.classList.contains('btn__removequeue')) {
    let songId = e.target.dataset['id'];
    removeFromQueue(songId, queueList);
  }
  playSongFromList(e);
});

// Volym (Ska slås ihop med play/pause eventlistner med hjälp av bubbling event senare.)
mediaPlayerCont.addEventListener('click', (e) => {
  volumeControl(e, musicPlayer);
});

async function playSongFromList(e) {
  let songId = e.target.dataset['id'];

  if (e.target.classList.contains('btn__playsong')) {
    queueList.unshift(searchResult[songId]);
    displaySelectedSongDetails(songId, searchResult);
    displayQueue(queueList);
    // console.log(queueList);
    musicPlayerSrc.src = searchResult[songId].preview_url;
    musicPlayer.load();
    isPlaying = await playPauseMedia(
      false,
      musicPlayer,
      btnPlayPause
    );
    startTimer(musicPlayer);
  } else if (e.target.classList.contains('btn__queuesong')) {
    addToQueue(songId);
  }
}

function addToQueue(songIndex) {
  // console.log(songIndex);
  queueList.push(searchResult[songIndex]);
  displayQueue(queueList);
  return;
}
