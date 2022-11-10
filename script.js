const searchResultEl = document.querySelector('.search__result');
const inputField = document.querySelector('.search__field');
const btnSearch = document.querySelector('.button__search');
const btnPlayPause = document.querySelector('.btn--playpause');
const musicPlayer = document.querySelector('.music_player');
const musicPlayerSrc = document.querySelector('source');
const playingAlbumArtEl = document.querySelector('.albumart__img');
const playingArtistEl = document.querySelector('.artist');
const playingTitleEl = document.querySelector('.song');
const volumeUpBtn = document.querySelector('.volumeup');
const volumeDownBtn = document.querySelector('.volumedown');
const volumeEl = document.querySelector('.show__volume');
const musicPlayerContainer = document.querySelector(
  '.player__container'
);
let currentTimeEl = document.querySelector('.current__time');
let totalTimeEl = document.querySelector('.total__time');
volumeEl.textContent = `Volume: ${Math.floor(
  musicPlayer.volume * 10
)}`;
let currentPlayTime;
let totalPlayTime;
let timer = 0;
let isPlaying = false;
let searchResult = [];
let inputSearchField = '';
let token = '';

// Sökfältet
btnSearch.addEventListener('click', async () => {
  removeSearchResults();
  await getToken();
  inputSearchField = inputField.value;
  searchSong();
});

// Play/Pause Mediaplayer
btnPlayPause.addEventListener('click', () => {
  if (!isPlaying) {
    musicPlayer.play();
    isPlaying = true;
    btnPlayPause.textContent = 'Pause';
  } else if (isPlaying) {
    musicPlayer.pause();
    isPlaying = false;
    btnPlayPause.textContent = 'Play';
  }
});

// Starta låt från sökresultat.
document.addEventListener('click', async function (e) {
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
  }
});

// Volym (Ska slås ihop med play/pause eventlistner med hjälp av bubbling event senare.)
musicPlayerContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('volumeup')) {
    if (musicPlayer.volume < 1.0) {
      musicPlayer.volume = musicPlayer.volume + 0.1;
      volumeEl.textContent = `Volume: ${Math.floor(
        musicPlayer.volume * 10
      )}`;
    } else return;
  } else if (e.target.classList.contains('volumedown')) {
    if (musicPlayer.volume > 0.01) {
      musicPlayer.volume = musicPlayer.volume - 0.1;
      volumeEl.textContent = `Volume: ${Math.floor(
        musicPlayer.volume * 10
      )}`;
    } else return;
  }
});

async function getToken() {
  const response = await fetch(
    `https://blooming-reef-63913.herokuapp.com/api/token`
  );
  data = await response.json();
  token = data.token;
  return token;
}

async function searchSong() {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=track%3A${inputSearchField}&type=track&limit=5`,
    {
      headers: {
        Accept: 'application / json',
        'Content-Type': 'application / json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  data = await response.json();
  searchResult = data.tracks.items;
  displaySearchResults();
  return;
}

function displaySearchResults() {
  for (let i = 0; i < searchResult.length; i++) {
    const renderArtist = `<article class="result__container ${i}">
    <h3 class="result__artist">${searchResult[i].artists[0].name}</h3>
    <p class="result__songtitle">${searchResult[i].name}</p>
    <img class="result__albumcover" src="${searchResult[i].album.images[1].url}"/>
    <button class="btn__playsong" data-id="${i}">Play Song</button>
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

function displaySongDetails(songId) {
  musicPlayerSrc.src = searchResult[songId].preview_url;
  playingArtistEl.textContent = searchResult[songId].artists[0].name;
  playingTitleEl.textContent = searchResult[songId].name;
  playingAlbumArtEl.src = searchResult[songId].album.images[1].url;
}

function volumeControl() {
  console.log(musicPlayer.volume);
}

function updateTimer() {
  currentPlayTime = Math.round(musicPlayer.currentTime);
  currentTimeEl.textContent = currentPlayTime;
}

function startTimer() {
  timer = setInterval(updateTimer, 1000);
  updateTimer();
}
