console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();

function getquery() {
    // var query = document.getElementById("searchbar").value.toLowerCase().trim();
    var query = document.getElementById("searchbar").value//.toLowerCase().trim();
    if (query == '') {
        return //console.log('empty input')
    }
    document.getElementById("definition").innerHTML = '';
    
    if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("definiton").innerHTML = 'invalid input';
    }
    else {
        searchquery(query);
        // clearInput();
    }
}

async function searchquery(query) {
    var suggestioncode = ''
    globalThis.query = query;
    //QQ 1: definiton
    if (query in cndata) {
        raw = cndata[query];
        document.getElementById("title").innerHTML = query;
        document.getElementById("definition").innerHTML = raw['definition'];
        //QQ 2: color theme
        setTheme(`${raw['subject']}-theme`);
    }
    else {
        return document.getElementById("definition").innerHTML = 'No result';
    }
    //QQ 3: translation
    document.getElementById("translation").innerHTML = await translatedef(query);
    //QQ 4: suggestion
    var suggestionlist = Object.keys(cndata).filter(title => cndata[title].chapter === "1");
    suggestionlist.forEach(suggested => {
        suggestioncode += `<div class="suggestion"><p>${suggested}</p> <button onclick="searchquery('${suggested}')"><ion-icon name="chevron-forward-outline"></ion-icon></button></div>`

    });
    document.getElementById("suggestionbox").innerHTML = suggestioncode;
    clearInput();
}


function escapeRegExp(string) {// Function to escape special characters in words for use in regex
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function openwiki() {
    window.open(`https://en.wikipedia.org/w/index.php?search=${query}`,'_blank');
}
function opengoogle() {
    window.open(`https://www.google.com/search?q=${query}`,'_blank')
}

async function translatedef(query) { //test: hetero
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ms&dt=t&q=${encodeURI(query)}`)
    raw = await response.json()
    console.log(raw[0][0][0])
    return raw[0][0][0];
}





//QQ ui functions
function clearInput() {
    document.getElementById("searchbar").value = "";
    document.getElementById("searchbar").focus();
    document.getElementById('goto').scrollIntoView({behavior: 'smooth'});
    setTimeout(window.scrollTo(0,0),100);
}

var form = document.getElementById("searchform");
function handleForm(event) {
    event.preventDefault();
    getquery();
}
form.addEventListener('submit', handleForm);



