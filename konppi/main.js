document.documentElement.className = localStorage.getItem('theme');
console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();

function getquery() {
    var query = document.getElementById("searchbar").value.toLowerCase().trim();
    if (query == '') {
        return
    }
    document.getElementById("definition").innerHTML = `<img src='https://http.cat/images/102.jpg';>`;
    
    if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("definition").innerHTML = `<img src='https://http.cat/images/406.jpg';>\nOnly alphabetic characters are currently supported.`
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

        var chapternum = isNaN(raw['CHAPTER']) ? raw['CHAPTER'] : `Chapter ${raw['CHAPTER']}`;
        document.getElementById("definition").innerHTML = raw['DEFINITION'].replaceAll(`\\n`, `<br><br>`) + `<br><br><em>${chapternum}</em>` ;
        //QQ 2: color theme
        setTheme(`${raw['SUBJECT']}-theme`);
        document.getElementById("subject").innerHTML = raw['SUBJECT'];
    }
    else {
        return document.getElementById("definition").innerHTML = `<img src='https://http.cat/images/404.jpg';>\nNo result. Try Google`;
    }

    //QQ 4: suggestion
    const suggestionlist = Object.fromEntries(Object.entries(cndata).filter(([key, value]) => value.CHAPTER ==raw['CHAPTER'] && value.SUBJECT ==raw['SUBJECT']) );
    Object.entries(suggestionlist).forEach(([suggested, value]) => {
        suggestioncode += `<div class="suggestion"><p>${suggested}</p> <button onclick="searchquery('${suggested}')"><ion-icon name="chevron-forward-outline"></ion-icon></button></div>`
    });// console.log(suggestionlist)
    document.getElementById("suggestionbox").innerHTML = suggestioncode;

    //QQ 3: translation 
    document.getElementById("translation").innerHTML = await translatedef( raw['DEFINITION'].replaceAll(`\\n`, `<br><br>`));//it run will ridicuosly change raw to array
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

function buttonclick() {
    getquery();
}


// Immediately invoked function to set the theme on initial load
(function () {
    const themedata = {
        "biology-theme": {
            "DEFINITION": "Biology is the scientific study of life and living organisms.\n\nIt's a fascinating subject that explores everything from the smallest molecules within cells to entire ecosystems and the interactions between organisms and their environment.",
            "SUBJECT": "Biology"
        },
        "physics-theme": {
            "DEFINITION": "Physics is the branch of science that deals with the nature and properties of matter and energy.\n\nIt's a fundamental discipline that helps us understand how the universe works, from the smallest particles to the largest galaxies.",
            "SUBJECT": "Physics"
        },
        "chemistry-theme": {
            "DEFINITION": `Chemistry is the branch of science that studies the composition, structure, properties, and reactions of matter.\n\nIt explores how different substances interact with each other and how these interactions can be used to create new materials or products.\nEssentially, chemistry helps us understand the "why" and "how" behind the changes that occur in our world.`,
            "SUBJECT": "Chemistry"
        },
    }
    
    const theme = localStorage.getItem('theme');
    document.getElementById("definition").innerHTML = themedata[theme]["DEFINITION"]
    document.getElementById("title").innerHTML = themedata[theme]["SUBJECT"]
})();