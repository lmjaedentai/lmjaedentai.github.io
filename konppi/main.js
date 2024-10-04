document.documentElement.className = localStorage.getItem('theme');
console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();
const predictbox = document.getElementById("predictbox");

function getquery() {
    var query = document.getElementById("searchbar").value.toLowerCase().trim();
    if (query == '') {
        return
    }
    document.getElementById("definition").innerHTML = `<img src='https://http.cat/images/102.jpg';>`;
    
    if (!/^[A-Za-z0-9\s\-'’.]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("definition").innerHTML = `<img src='https://http.cat/images/406.jpg';>\nOnly alphabetic characters are currently supported.`
    }
    else {
        searchquery(query);
    }
}

const listofterm = Object.keys(cndata);
document.getElementById("searchbar").onkeyup = (e) => {
    let userinput = e.target.value; //user enetered data
    let predicted_query = [];
    if (userinput) {
        predicted_query = listofterm.filter((data) => {
            //filtering array value and user characters to lowercase and return only those words which are start with user enetered chars
            return data.toLocaleLowerCase().startsWith(userinput.toLocaleLowerCase());
        });
        // console.log(predicted_query)
        predicted_query = predicted_query.map((data) => {
            return (data = `<div id="predicted">` + data + "</div>");// passing return data inside div tag
        });

        showtestsuggest(predicted_query);
        for (let i = 0; i < predictbox.querySelectorAll("div").length; i++) {
            predictbox.querySelectorAll("div")[i].setAttribute("onclick", "select(this)");//adding onclick attribute in all div tag
        }
    }
    else {
        showtestsuggest([' ']);
    }
};

function select(element, event) {
    let selectData = element.textContent;
    document.getElementById("searchbar").value = selectData;
}

function showtestsuggest(list) {
    let listData;
    if (!list.length) {
        userValue = document.getElementById("searchbar").value;
        listData = `<div id="predicted">` + userValue + "</div>";
    } else {
        listData = list.join("");
    }
    predictbox.innerHTML = listData;
}

async function searchquery(query) {
    document.getElementById("definition").innerHTML = `<img src='https://http.cat/images/102.jpg';>\n\nloading...`;
    var suggestioncode = ''
    globalThis.query = query;
    document.getElementById("title").innerHTML = query;
    //QQ 1: definiton
    if (query in cndata) {
        raw = cndata[query];
        console.table({t:query,d:raw['DEFINITION'],c:raw['CHAPTER'],s:raw['SUBJECT'],m:raw['SEM']})

        var chapternum = isNaN(raw['CHAPTER']) ? raw['CHAPTER'] : `Chapter ${raw['CHAPTER']}`;
        var semnum = isNaN(raw['SEM']) ? raw['SEM'] : `Semester ${raw['SEM']}`;
        //NOTE: outpput print here
        document.getElementById("definition").innerHTML = raw['DEFINITION'].replaceAll(`\\n`, `<br><br>`) + `<br><br><em onclick="location.href = './search.html#suggestionbox'">${chapternum}</em>` + `<em>${semnum}</em>` ;
        //QQ 2: color theme
        setTheme(`${raw['SUBJECT']}-theme`);
        document.getElementById("subject").innerHTML = raw['SUBJECT'];
    }
    else {
        clearInput();
        en_definition = await getDefinition(query)
        return document.getElementById("definition").innerHTML = `<em>No Result  :(</em><br><br><b>Free dictionary API:</b><br>${en_definition}<br><br><img src='https://http.cat/images/404.jpg';>\nThe term you are looking for is not in our database. <a href="https://en.wiktionary.org/wiki/${query}">source</a>`;
    }

    //QQ 4: suggestion
    const suggestionlist = Object.fromEntries(Object.entries(cndata).filter(([key, value]) => value.CHAPTER ==raw['CHAPTER'] && value.SUBJECT ==raw['SUBJECT'] && value.SEM ==raw['SEM']) );
    Object.entries(suggestionlist).forEach(([suggested, value]) => {
        suggestioncode += `<div class="suggestion" onclick="searchquery('${suggested}')"><p>${suggested}</p> <button onclick="searchquery('${suggested}')"><ion-icon name="chevron-forward-outline"></ion-icon></button></div>`
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

async function getDefinition(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }      
        const data = await response.json();
        return data[0].meanings[0].definitions[0].definition;
    } catch (error) {
        return "no result";
    }
}






//QQ ui functions
function clearInput() {
    showtestsuggest([' ']);
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
        "compsc-theme": {
            "DEFINITION": `Fundamental areas of computer science Computer science is the study of computation, information, and automation. Computer science spans theoretical disciplines to applied disciplines. Algorithms and data structures are central to computer science.`,
            "SUBJECT": "Computer Science"
        },
    }
    
    const theme = localStorage.getItem('theme');
    document.getElementById("definition").innerHTML = themedata[theme]["DEFINITION"]
    document.getElementById("title").innerHTML = themedata[theme]["SUBJECT"]
})();