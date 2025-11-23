//QQ format lyrics

function getquery() {
    var query = document.getElementById("searchinput").value.toLowerCase().trim();
    
    if (query == '') {
        return 
    }
    document.getElementById("title").innerHTML = ''
    document.getElementById("author").innerHTML = '';
    // document.getElementById("album").innerHTML = '';
    // document.getElementById("cover").innerHTML =''
    document.getElementById("lyrics").innerHTML = '';
    searchquery(query);
}

function searchquery(song) { 
    fetch(`https://api.popcat.xyz/v2/lyrics?song=${encodeURIComponent(song)}`).then(res => res.json()).then(json => {

        const { error, message } = json;
        console.log('recevied'+song)
        if (error) return formatoutput({ title: song, author: "song not found", lyrics: "sorry for the inconvenience"})
        console.log(message);

        var reallyrics = cleanlyrics(message.lyrics);
        formatoutput({ title: message.title.replace(/ *\([^)]*\) */g, ""), author: message.artist.replace(/ *\([^)]*\) */g, ""), lyrics: reallyrics, link: message.url })
    });
}


function cleanlyrics(q) {
    const lyricsKeyword = "Lyrics";
    const lyricsKeywordIndex = q.indexOf(lyricsKeyword);
    if (lyricsKeywordIndex !== -1) {
        q = q.substring(lyricsKeywordIndex + lyricsKeyword.length).trim();
    }

    const startIndex = q.indexOf('[');
    if (startIndex !== -1) { 
        q = q.substring(startIndex).trim();
    }
    q = q.replaceAll("[", "<span>");
    q = q.replaceAll("]", "</span>");
    q = q.replaceAll("\n\n\n\n", "\n\n");
    return q.trim();
}



function formatoutput({ title = '', author = '', cover = '', lyrics = '', link = '' }) {
    globalThis.title = title;
    globalThis.link = link;
    document.getElementById("title").innerHTML = (title != '') ? title : document.getElementById("title").innerHTML;
    document.getElementById("author").innerHTML = (author != '') ? author : document.getElementById("author").innerHTML;
    document.getElementById("lyrics").innerHTML = (lyrics != '') ? lyrics : document.getElementById("lyrics").innerHTML;
    // document.getElementById("album").innerHTML =  (album!= '') ? album : document.getElementById("album").innerHTML;
    // document.getElementById("cover").innerHTML =  (cover!= '') ? `<img src=${cover}>` : document.getElementById("cover").innerHTML;
    clearInput();
}

function clearInput() {
    document.getElementById("searchinput").value = "";
    // document.getElementById("searchinput").focus();
    setTimeout(window.scrollTo(0,0),100);
    document.getElementById('title').scrollIntoView({behavior: 'smooth'});
}
// formatoutput({title:'a', author:'b', album:'c', cover:'d', lyrics:'e', link:'https://genius.com/Alan-walker-faded-lyrics'})

var form = document.getElementById("searchform");
function handleForm(event) {
    event.preventDefault();
    getquery();
}
form.addEventListener('submit', handleForm);



//QQ ui func
document.getElementById('searchinput').addEventListener('focus', function(){
    document.getElementById('searchbar').style.borderRadius = "10px";
    document.getElementById('searchbar').style.width = "300px";
    document.getElementById('searchbar').style.overflow = "visible";
});

document.getElementById('searchbar').addEventListener('hover', function(){
    document.getElementById('searchinput').focus();
    document.getElementById('searchbar').style.borderRadius = "10px";
    document.getElementById('searchbar').style.width = "300px";
    document.getElementById('searchbar').style.overflow = "visible";
});

function openinfo() {
    document.getElementById('infobox').style.width = "80%";
    document.getElementById('infobox').style.visibility = "visible";
}

function closeinfo() {
    document.getElementById('infobox').style.width = "0px";
    document.getElementById('infobox').style.visibility = "hidden";
}

function musicbutton() {
    window.open(`https://www.youtube.com/results?search_query=${title}`,'_blank')
}

function geniusbutton() {
    window.open(link,'_blank')
}