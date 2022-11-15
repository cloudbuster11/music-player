import { getToken, searchSong } from './modules/api.js';
const searchResultEl = document.querySelector('.search__result');
const inputField = document.querySelector('.searchbar__inputfield');
const btnSearch = document.querySelector('.btn__search');
const btnPlayPause = document.querySelector('.btn__playpause');
const musicPlayer = document.querySelector('.music_player');
const musicPlayerSrc = document.querySelector('source');
const playingAlbumArtEl = document.querySelector(
  '.currenttrack__almbumart'
);
const addToQueueBtn = document.querySelector('.btn__queuesong');
const queueListEl = document.querySelector('.queue__list');

const playingArtistEl = document.querySelector(
  '.currenttrack__artist'
);
const playingTitleEl = document.querySelector('.currenttrack__title');
const volumeUpBtn = document.querySelector('.btn-volumeup');
const volumeDownBtn = document.querySelector('.btn-volumedown');
const volumeEl = document.querySelector('.volume__display');
const musicPlayerContainer = document.querySelector(
  '.playercontrolls__container'
);
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
  removeSearchResults();
  await getToken();
  console.log('test');
  inputSearchField = inputField.value;
  searchResult = await searchSong(inputSearchField);
  displaySearchResults();
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

function displaySearchResults() {
  for (let i = 0; i < searchResult.length; i++) {
    const renderArtist = `<article class="result__container ${i}">
    <h4 class="result__artist">${searchResult[i].artists[0].name}</h4>
    <p class="result__songtitle">${searchResult[i].name}</p>
    <p class="result__albumname">${searchResult[i].album.name}</p>
    <img class="result__albumcover" src="${searchResult[i].album.images[1].url}"/>
    <button class="btn__playsong btn__result" data-id="${i}">Play Song</button><button class="btn__queuesong btn__result" data-id="${i}">Queue</button>
    </article>`;
    searchResultEl.innerHTML += renderArtist;
  }
}

function removeSearchResults() {
  const renderedResults = document.querySelectorAll(
    '.result__container'
  );
  searchResult = [];
  renderedResults.forEach((el) => {
    el.remove();
  });
}

async function playSongFromList(e) {
  if (e.target.classList.contains('btn__playsong')) {
    let songId = e.target.dataset['id'];
    displaySongDetails(songId);
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

function displaySongDetails(songId) {
  musicPlayerSrc.src = searchResult[songId].preview_url;
  playingArtistEl.textContent = searchResult[songId].artists[0].name;
  playingTitleEl.textContent = searchResult[songId].name;
  playingAlbumArtEl.src = searchResult[songId].album.images[1].url;
}
// Måste hitta annan lösning på nedan
let queueIndex = 0;

function addToQueue(songIndex) {
  console.log(songIndex);
  queueList.push(searchResult[songIndex]);
  displayQueue(queueIndex);
  queueIndex++;
  return;
}

function displayQueue(songIndex) {
  console.log(songIndex);
  let renderQueue = `<article class="queue__container ${songIndex}">
    <h4 class="queue__artist">${queueList[songIndex].artists[0].name}</h4>
    <p class="queue__songtitle">${queueList[songIndex].name}</p>
    <button class="btn__playsong btn__result" data-id="${songIndex}">Play Song</button>
    </article>`;
  queueListEl.innerHTML += renderQueue;
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
