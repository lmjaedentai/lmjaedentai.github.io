var music = new Audio('./asset/music.mp3');

function playmusic(){
    if(music.paused || music.ended) {
        music.play();
    } else {
        music.pause();
    }
}
