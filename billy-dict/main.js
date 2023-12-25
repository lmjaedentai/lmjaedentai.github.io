console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();
var englishlemmatize = false;
// var contextmenu = document.querySelector(".contextmenu");

function getquery() {
    var query = document.getElementById("searchbar").value.toLowerCase().trim();
    document.getElementById("phonetic").innerHTML ='<img data-ujs-name="Happy music"/>\n\nSearching...'
    document.getElementById("definition").innerHTML = '';
    document.getElementById("chinese").innerHTML = '';
    document.getElementById("thesaurus").innerHTML = '';

    if (query == '') {
        return //console.log('empty input')
    }
    if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("phonetic").innerHTML='<img data-ujs-name="Access denied"/>\n\nOnly alphabetic characters are acceptable.'
    }
    else {
        searchquery(query);
    }
}

// function gethighlighted() {
//     var query = document.getSelection().toString().toLowerCase().trim();
//     contextmenu.style.display = "none";
//     if (query == '') {
//         return //console.log('empty input')
//     }
//     if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
//         return document.getElementById("phonetic").innerHTML='<img data-ujs-name="Cancel"/>\n\nOnly alphabetic characters are acceptable.'
//     }
//     else {
//         document.getElementById("phonetic").innerHTML='<img data-ujs-name="Happy music"/>\n\nSearching...'
//         searchquery(query);
//     }
// }

function searchquery(query, second = false) {
    document.getElementById("phonetic").innerHTML = '';       
    fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${query}?key=fea702b3-bccf-47c3-b29e-2293789b70af`)
        .then((response) => response.json())
        .then(function (raw) {
            if (second == false) {
                document.getElementById("searchtitle").innerHTML = query;
            }
            // console.warn('i start my job')
            formatoutput(englishdef(raw, query, second), chinesedef(query, raw), query, second);
    });
    fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${query}?key=1b547310-00e9-418a-b23f-b73d22906f1c`)
        .then((response) => response.json())
        .then(function (raw) {
            formatoutput('','','','','',thesaurus(raw, query));
    });
}

function englishdef(raw, search, second = false) {
    var english_output = '\n\n';
    let block = true;
    let n = 1;

    //QQ error handling
    if (raw === undefined || raw == "" || raw[0].hasOwnProperty('meta') == false) {
        if (second == false) {
            if (!raw || raw.length === 0 || raw === undefined) {
                document.getElementById("phonetic").innerHTML = '<img data-ujs-name="Page not found"/>\n\nNo result'; return
            }
            else { //autocorrect
                englishlemmatize = true;
                searchquery(raw[0].toLowerCase().trim(), true);
                // console.table(raw);
            }
        }
        else { //second time
            document.getElementById("phonetic").innerHTML = '<img data-ujs-name="Page not found"/>\n\nNo result'; return
        }
    }
    else { //no error
        // console.table(raw[0]["meta"]["stems"]);
        for (let elements in raw) { //check if search query available
            if (raw[elements]["hwi"]["hw"] == search ||
                raw[elements]["meta"]["id"] == search ||
                raw[0]["meta"]["stems"].map(word => word.toLowerCase()).includes(search) ||
                raw[elements]["hwi"]["hw"] == raw[0]["meta"]["stems"][0] ||
                raw[elements]["meta"]["id"] == raw[0]["meta"]["stems"][0]
            ) {
                if (raw[elements]["shortdef"].length == 0) {
                    continue; //the definition is unavailable
                }
                else { //print def
                    english_output += `\n<strong>${raw[elements]['fl']}</strong>`; //print part of speech
                    for (definitions in raw[elements]["shortdef"]) {
                        // english_output += `\n${n}. ${raw[elements]["shortdef"][definitions]}`;
                        english_output += `<li>${raw[elements]["shortdef"][definitions]}</li> `;
                        n++
                    }
                    // console.log(raw[elements]['fl'], raw[elements]["shortdef"].length);
                    // console.table(raw[elements]["shortdef"]);
                }
            }
            if (raw[elements].hasOwnProperty('art')) { //print img
                english_output += `\n<img src="https://www.merriam-webster.com/assets/mw/static/art/dict/${raw[elements]['art']['artid']}.gif">\n`;
            }
            if (raw[elements]["meta"]["offensive"] && block) { //offensive
                if (window.confirm("The word is offensive. Do you wish to proceed?")) {
                    block = false;
                }
                else {
                    document.getElementById("phonetic").innerHTML = '<img data-ujs-name="Taken"/>\n\nNo content'; return
                }
            }
        }

        if (english_output == '' || english_output === undefined) { //no result but merriam give another word
            document.getElementById("phonetic").innerHTML = '<img data-ujs-name="Taken"/>\n\nNo content'; return
        }
        else { //formatting
            english_output = english_output.replaceAll("(", "<span>(");
            english_output = english_output.replaceAll(")", ")</span>");
            english_output = english_output.replace("\n\n\n", "");
            english_output = `<ol type='1'>${english_output}</ol>`;
            return english_output
        }
    }
}

//QQ bingqiling
function chinesedef(query, englishraw, second = false, third = false) {
    const targetlist = ['noun', 'adverb', 'adjective', 'verb', 'Ad\n\nVerb: : ', 'preposition', 'conjunction', 'article', 'pronoun', 'pro\n\nNoun: ', 'exclamation'];
    const replacelist = ['Noun', 'Adverb', 'Adjective', 'Verb', 'Adverb', 'Preposition', 'Conjunction', 'Articles', 'Pronouns', 'Pronouns', 'Exclamation'];
    var chinese_output = ''

    if (query in cndata) {
        chinese_output = cndata[query];
        //formatting
        for (let i = 0; i < targetlist.length; i++) {
            chinese_output = chinese_output.replaceAll(targetlist[i], `\n\n<strong>${replacelist[i]}</strong>`);
        }
        for (let n = 43; n > 0; n--) {
            if (chinese_output.includes(`${n}. `)) {
                chinese_output = chinese_output.replaceAll(`${n}. `, `\n<span> • </span>`);
            }
        }
        if (second) { //lemmatize sucessfully
            formatoutput(custom=`<span class="info">Your query has been lemmatized to "${query}"</span>`)
        }
    }
    else { //query not in cndata
        if (third != false) { //3rd time error --> translate
            third = '<strong>Google translated</strong>\n' + third
            // console.table({ searchinput: query, english: englishraw, translated: third, en_second_trial: englishlemmatize })
            return formatoutput(englishdef(englishraw, query, second), third, query, englishlemmatize, `<span class="info">Translation accuracy not guaranteed.</span>`);
        }
        else if (second) {//2nd try still no result
            translatedef(query, englishraw);
        }
        else { //first time error
            if (!englishraw || englishraw.length === 0 || englishraw === undefined) { //404 in english
                return chinese_output = '';
            }
            if (englishraw[0].hasOwnProperty('meta')) {//else if autocorrect but not apply here, will change query for only cn
                var searchpure = englishraw[0]["meta"]["stems"][0]; //lemmatize the word
                // console.table({ lemmatize: chinese_output })
                return chinesedef(searchpure, englishraw, second = true);
            }
        }
    }
    chinese_output = chinese_output.replaceAll(`；`, `<span>；</span>`);
    chinese_output = chinese_output.replaceAll(`(`, `<span>(`);
    chinese_output = chinese_output.replaceAll(`)`, `)</span>`);
    chinese_output = chinese_output.replace(`\n\n`, ``);
    // console.table({return_normal: chinese_output})
    return chinese_output;
}

async function translatedef(query, englishraw) { //test: hetero
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURI(query)}`)
        .then((response) => response.json())
        .then(function (translated_output) {
            // console.log(translated_output[0][0][0])
            return chinesedef(query, englishraw, true, translated_output[0][0][0])
        });
}

function thesaurus(raw, search) {
    var synonym = []
    if (raw === undefined || raw == "" || raw[0].hasOwnProperty('meta') == false) {
        return
    }
    else { //no error
        for (let elements in raw) { //check if search query available
            if (raw[elements]["hwi"]["hw"] == search || raw[elements]["meta"]["id"] == search || raw[0]["meta"]["stems"].map(word => word.toLowerCase()).includes(search) || raw[elements]["hwi"]["hw"] == raw[0]["meta"]["stems"][0] || raw[elements]["meta"]["id"] == raw[0]["meta"]["stems"][0]) {
                for (let slist in raw[elements]["meta"]["syns"]) {
                    for (let s in raw[elements]["meta"]["syns"][slist]) {
                        synonym.push(raw[elements]["meta"]["syns"][slist][s]);
                        if (synonym.length> 21) { break; }
                    }
                }
            }
        }
        tableraw = `<table>`
        for (var i = 0; i < synonym.length; i++) {
            if (i % 3 == 0) {
                if (i > 0)tableraw += '</tr>';
                tableraw += '<tr>'
            }
            tableraw += `<td>${synonym[i]}</td>`
        }
        tableraw += '</tr></table>'
        return tableraw + `</table>`
    }
}

function formatoutput(english_output='', chinese_output='', search='', second=false,custom='',table='') {
    // console.table({ en: english_output, cn: chinese_output ,custom:custom, table:table});
    document.getElementById("phonetic").innerHTML = second ? `<span class="error">did you mean: ${search}</span>` : document.getElementById("phonetic").innerHTML;
    document.getElementById("definition").innerHTML = (english_output != '') ? english_output : document.getElementById("definition").innerHTML;
    document.getElementById("chinese").innerHTML = (chinese_output != '') ? chinese_output : document.getElementById("chinese").innerHTML;
    document.getElementById("phonetic").innerHTML = (custom != '') ? custom : document.getElementById("phonetic").innerHTML;
    document.getElementById("thesaurus").innerHTML =  (table != '') ? table : document.getElementById("thesaurus").innerHTML;
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



// //QQ beta
// var pageX, pageY;
// document.addEventListener("mouseup", () => {
//     let selectedText = document.getSelection().toString();
//     if (selectedText !== "") {
//         contextmenu.style.display = "flex";
//         contextmenu.style.left = "80%";
//         contextmenu.style.top = pageY+ "px";
//     }
//     else {
//         contextmenu.style.display = "none";
//     }
// });

// document.addEventListener("mousedown", (e) => {
//     pageX = e.pageX;
//     pageY = e.pageY;
// });



