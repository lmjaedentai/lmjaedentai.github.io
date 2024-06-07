// const YoutubeMusicApi = require('youtube-music-api')
// const fs = require('fs');

// var data;



// const api = new YoutubeMusicApi()
// api.initalize() // Retrieves Innertube Config
// .then(info => {
// 	// api.getSearchSuggestions("ne deve ne kush").then(result => {
// 	// 	console.log(result)
// 	// })

// 	api.search("ne deve ne kush", "song").then(result => savejson(result)) // just search for songs
// 	api.getLyrics("kvoO5hwsYQo").then(result => console.log(result));

// })

// function savejson(x) {
// 	var dictstring = JSON.stringify(x);
// 	fs.writeFile("thing.json", dictstring, function(err, result) {
// 		if(err) console.log('error', err);
// 	});
// }

//LINK https://www.npmjs.com/package/genius-lyrics-api

const Genius = require("genius-lyrics");
const Client = new Genius.Client("qma-5joJ51Pld9Z-32N8CT0oUs55qYA0ANV8Druvve7me9YUpqfniXEdNyXWqjE7");

const searches = await Client.songs.search("faded");

// Pick first one
const firstSong = searches[0];
console.log("About the Song:\n", firstSong, "\n");

// Ok lets get the lyrics
const lyrics = await firstSong.lyrics();
console.log("Lyrics of the Song:\n", lyrics, "\n");