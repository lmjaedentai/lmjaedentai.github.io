var spike = document.getElementById("spike");
var audio = new Audio('./asset/pop.mp3');
var scoreboard = document.getElementById('scoreboard');
var menu = document.getElementById('menu');
var score = 0;


// mouseclick & touchscreen event
spike.addEventListener("mousedown", function(){
    spike.style.width = '156px';
    audio.play();
});

spike.addEventListener("mouseup", function () {

    spike.style.width = '350px';
    increaseScore();
});

spike.addEventListener("touchstart", function(){
    spike.style.width = '156px';
    audio.play();
});

spike.addEventListener("touchmove", function(){
    spike.style.width = '350px';
    increaseScore();
});

function increaseScore(){
    score++;
    scoreboard.innerHTML = score;
    if(score == 150){ //if no cookie
        window.alert("justin is insensitive");
    }
}

