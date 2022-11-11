const searchResultEl = document.querySelector('.search__result');
const inputField = document.querySelector('.search__field');
const btnSearch = document.querySelector('.button__search');
const btnPlayPause = document.querySelector('.btn--playpause');
const musicPlayer = document.querySelector('.music_player');
const musicPlayerSrc = document.querySelector('source');
const playingAlbumArtEl = document.querySelector('.albumart__img');
const addToQueueBtn = document.querySelector('.btn__queuesong');
const queueListEl = document.querySelector('.queue__list');

const playingArtistEl = document.querySelector('.artist');
const playingTitleEl = document.querySelector('.song');
const volumeUpBtn = document.querySelector('.volumeup');
const volumeDownBtn = document.querySelector('.volumedown');
const volumeEl = document.querySelector('.show__volume');
const musicPlayerContainer = document.querySelector(
  '.player__container'
);
const mediaPlayerCont = document.querySelector(
  '.mediaplayer__container'
);
let currentTimeEl = document.querySelector('.current__time');
let totalTimeEl = document.querySelector('.total__time');
