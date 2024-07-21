document.documentElement.className = localStorage.getItem('theme');
console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();

function getquery() {
    var query = document.getElementById("searchbar").value.toLowerCase().trim();
    if (query == '') {
        return
    }
    document.getElementById("definition").innerHTML = '';
    
    if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("definiton").innerHTML = 'invalid input';
    }
    else {
        searchquery(query);
    }
}

async function searchquery(query) {
    var suggestioncode = ''
    globalThis.query = query;
    //QQ 1: definiton
    if (query in cndata) {
        raw = cndata[query];
        // console.table({t:query,d:raw['DEFINITION'],c:raw['CHAPTER'],s:raw['SUBJECT']})
        document.getElementById("title").innerHTML = query;
        document.getElementById("definition").innerHTML = raw['DEFINITION'].replaceAll(`\\n`, `<br><br>`);;
        //QQ 2: color theme
        setTheme(`${raw['SUBJECT']}-theme`);
        document.getElementById("subject").innerHTML = raw['SUBJECT'];
    }
    else {
        return document.getElementById("definition").innerHTML = 'No result';
    }

    //QQ 4: suggestion
    const suggestionlist = Object.fromEntries(Object.entries(cndata).filter(([key, value]) => value.CHAPTER ==raw['CHAPTER'] && value.SUBJECT ==raw['SUBJECT']) );
    Object.entries(suggestionlist).forEach(([suggested, value]) => {
        suggestioncode += `<div class="suggestion"><p>${suggested}</p> <button onclick="searchquery('${suggested}')"><ion-icon name="chevron-forward-outline"></ion-icon></button></div>`
    });// console.log(suggestionlist)
    document.getElementById("suggestionbox").innerHTML = suggestioncode;

    //QQ 3: translation 
    document.getElementById("translation").innerHTML = await translatedef(query);//it run will ridicuosly change raw to array
    clearInput();
}




async function translatedef(query) {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ms&dt=t&q=${encodeURI(query)}`)
    raw = await response.json();
    return raw[0][0][0];
}





//QQ ui functions
function clearInput() {
    document.getElementById("searchbar").value = "";
    // document.getElementById("searchbar").focus();
    document.getElementById('goto').scrollIntoView({behavior: 'smooth'});
    setTimeout(window.scrollTo(0,0),100);
}

document.getElementById("searchform").addEventListener('submit', event =>  {
    event.preventDefault();
    getquery();
});
