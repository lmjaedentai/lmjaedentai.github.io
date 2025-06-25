console.warn("test");
document.getElementById("searchbar").focus();
var englishlemmatize = false;
var contextmenu = document.querySelector(".contextmenu");

function getquery() {
    var query = document.getElementById("searchbar").value.toLowerCase().trim();
    if (query == '') {
        return
    }
    document.getElementById("phonetic").innerHTML = ''
    document.getElementById("definition").innerHTML = '';
    document.getElementById("chinese").innerHTML = '';
    
    if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("phonetic").innerHTML='Only alphabetic characters are acceptable.'
    }
    else {
        searchquery(query);
    }
}

async function searchquery(query, second = false) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(query)}`);
    raw = await response.json()
    if (second == false) {
        document.getElementById("searchtitle").innerHTML = query;
    }
    if (!Array.isArray(raw)) {
        if (raw.title && raw.message) {
            return formatoutput({ en: `Error: \n\n${raw.title} - ${raw.message}` });
        }
        return formatoutput({ en: `Error: Unexpected error` });
    }
    await chinesedef(query, raw, second);
    await englishdef(raw, query, second)

}

async function englishdef(raw, search, second = false, third=false) {
    var english_output = '';

    //QQ error handling
    if (!Array.isArray(raw) || raw.length === 0) {
        return "Error: Invalid or empty data";
    }
    // console.log(raw)
    const entry = raw[0];
    // console.log(entry)
    // console.log(english_output)
    entry.meanings.forEach((meaning, i) => {
        english_output += `\n<strong>${meaning.partOfSpeech}</strong>`;
        meaning.definitions.forEach((def, j) => {
            english_output += `\n<span> •  </span>${def.definition}\n`;
            if (def.example) {
                english_output += `     e.g. ${def.example}\n`;
            }
        });
    });
    english_output = english_output.replaceAll("(", "<span>(");
    english_output = english_output.replaceAll(")", ")</span>");
    english_output = english_output.replaceAll("e.g. ", "💡 ");
    formatoutput({en: english_output});
    return english_output.trim();
}


//QQ bingqiling
async function chinesedef(query, englishraw, second = false, third = false) {
    const targetlist = ['noun', 'adverb', 'adjective', 'verb', '<strong>\n\nAd<strong>\n\nVerb</strong></strong>', 'preposition', 'conjunction', 'article', 'pronoun', 'pro<strong>\n\nNoun</strong>', 'exclamation','Abbreviation'];
    const replacelist = ['Noun', 'Adverb', 'Adjective', 'Verb', 'Adverb', 'Preposition', 'Conjunction', 'Articles', 'Pronouns', 'Pronouns', 'Exclamation','Abbreviation'];
    var chinese_output = ''

    if (query in cndata) {
        chinese_output = cndata[query];
        //formatting
        for (let i = 0; i < targetlist.length; i++) {
            chinese_output = chinese_output.replaceAll(targetlist[i], `\n\n<strong>${replacelist[i]}</strong>`);
        }
        for (let n = 43; n > 0; n--) {
            if (chinese_output.includes(`${n}. `)) {
                chinese_output =  chinese_output.replaceAll(`${n}. `, `\n<span> • </span>`);
            }
        }
        if (second) { //lemmatize sucessfully
            formatoutput({e:`<span class="info">Your query has been lemmatized to "${query}"</span>`})
        }
    }
    else { 
        console.log("lollllllll");
        chinese_output = await translatedef(query);
        chinese_output = '<strong>Google translated</strong>\n' + chinese_output
    }
    
    chinese_output = chinese_output.replaceAll(`；`, `<span>；</span>`);
    chinese_output = chinese_output.replaceAll(`(`, `<span>(`);
    chinese_output = chinese_output.replaceAll(`)`, `)</span>`);
    chinese_output = chinese_output.replace(`\n\n`, ``);
    formatoutput({ cn: chinese_output });
}

async function translatedef(query) { //test: hetero
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURI(query)}`)
    trans = await response.json()
    return trans[0][0][0];
}

function formatoutput({ en = '', cn = '', q = '', second = false, e = ''}) {
    if (second || e != '') { //e can be info below title or seconndary query
        document.getElementById("phonetic").innerHTML = (second) ? `<span class="error">did you mean: ${q}</span>\n${e}` : e
    }
    //var = (cond) ? new : else_remain
    console.log(en)
    document.getElementById("definition").innerHTML = (en != '') ? en : document.getElementById("definition").innerHTML;
    document.getElementById("chinese").innerHTML = (cn != '') ? cn : document.getElementById("chinese").innerHTML;
    clearInput();
}




//QQ ui functions
function clearInput() {
    document.getElementById("searchbar").value = "";
    document.getElementById("searchbar").focus();
    setTimeout(window.scrollTo(0,0),100);
    document.getElementById('searchtitle').scrollIntoView({behavior: 'smooth'});
}

var form = document.getElementById("searchform");
function handleForm(event) {
    event.preventDefault();
    getquery();
}
form.addEventListener('submit', handleForm);



//QQ beta
function gethighlighted() {
    contextmenu.style.display = "none";
    searchquery(document.getSelection().toString().toLowerCase().trim());
}

var pageX, pageY;
document.addEventListener("mouseup", () => {
    let selectedText = document.getSelection().toString();
    if (selectedText !== "" && (/^[A-Za-z\s]*$/.test(selectedText.trim()))) {
        contextmenu.style.display = "flex";
        contextmenu.style.left = "75%";
        contextmenu.style.top = pageY + 15+ "px";
    }
    else {
        contextmenu.style.display = "none";
    }
});

document.addEventListener("mousedown", (e) => {
    pageX = e.pageX;
    pageY = e.pageY;
});
