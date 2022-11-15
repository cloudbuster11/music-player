export { getToken, searchSong };

let TOKEN = '';

async function getToken() {
  const response = await fetch(
    `https://blooming-reef-63913.herokuapp.com/api/token`
  );
  let data = await response.json();
  TOKEN = data.token;
}

async function searchSong(inputSearchField) {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=track%3A${inputSearchField}&type=track&limit=10`,
    {
      headers: {
        Accept: 'application / json',
        'Content-Type': 'application / json',
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
  let data = await response.json();
  searchResult = data.tracks.items;
  console.log(searchResult);
  displaySearchResults();
  return;
}
