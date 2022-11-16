export {
  displaySearchResults,
  removeSearchResults,
  displaySelectedSongDetails,
  displayQueue,
  removeFromQueue,
};

const playingArtistEl = document.querySelector(
  '.currenttrack__artist'
);
const playingTitleEl = document.querySelector('.currenttrack__title');
const playingAlbumArtEl = document.querySelector(
  '.currenttrack__almbumart'
);
const queueListEl = document.querySelector('.queue__list');

function displaySearchResults(searchResult, searchResultEl) {
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

function removeSearchResults(searchResult) {
  const renderedResults = document.querySelectorAll(
    '.result__container'
  );
  searchResult = [];
  renderedResults.forEach((el) => {
    el.remove();
  });
}

function displaySelectedSongDetails(songId, searchResult) {
  playingArtistEl.textContent = searchResult[songId].artists[0].name;
  playingTitleEl.textContent = searchResult[songId].name;
  playingAlbumArtEl.src = searchResult[songId].album.images[1].url;
}

function displayQueue(queueList) {
  const renderedQueueResults =
    document.querySelectorAll('.queue__song');
  renderedQueueResults.forEach((el) => {
    el.remove();
  });

  for (let i = 0; i < queueList.length; i++) {
    let renderQueue = `<li class="queue__song ${i}" data-id="${i}">${queueList[i].artists[0].name} - ${queueList[i].name}
    <button class="btn__removequeue" data-id="${i}">X</button></li>`;
    queueListEl.innerHTML += renderQueue;
  }
}

function removeFromQueue(songId, queueList) {
  queueList.splice(songId, 1);

  displayQueue(queueList);
}
