UndrawJS.init({ defaultColor: "#24ca9e" });

console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();
var englishlemmatize = false;
// var contextmenu = document.querySelector(".contextmenu");

function getquery() {
    var query = document.getElementById("searchbar").value.toLowerCase().trim();
    document.getElementById("phonetic").innerHTML = ''
    document.getElementById("definition").innerHTML = '';
    document.getElementById("chinese").innerHTML = '';
    document.getElementById("example").innerHTML =''

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

function searchquery(query, second = false) {
    fetch(`https://www.dictionaryapi.com/api/v3/references/medical/json/${query}?key=561ce2c0-ff20-49cd-b6ee-e1ff9efa247a`)
        .then((response) => response.json())
        .then(function (raw) {
            if (second == false) {
                document.getElementById("searchtitle").innerHTML = query;
            }
            // console.warn('i start my job')
            formatoutput({ en:englishdef(raw, query, second), cn:chinesedef(query, raw), q:query, second:second, exp:'' });
    });
}

function englishdef(raw, search, second = false) {
    var english_output = '\n\n';
    var example_output = '';

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
                else {
                    //QQ print def
                    english_output += `\n<strong>${raw[elements]['fl']}</strong>`; //print part of speech
                    for (definitions in raw[elements]["shortdef"]) {
                        english_output += `<li>${raw[elements]["shortdef"][definitions]}</li> `;
                    }
                }
            }
            //QQ print img
            if (raw[elements].hasOwnProperty('art')) {
                english_output += `\n<img src="https://www.merriam-webster.com/assets/mw/static/art/dict/${raw[elements]['art']['artid']}.gif">\n`;
            }

            //QQ bionote
            if ('bios' in raw[elements]) {
                raw[elements]['bios'].forEach(bios => {
                    bios.forEach(childbios => {
                        if ("bionw" == childbios[0]) {
                            if ('biosname' in childbios[1]) {
                                example_output += `<strong>${childbios[1]['biosname']}</strong>\n`
                            }
                        }
                        if ("biotx" == childbios[0]) {
                            example_output += `${childbios[1]}\n`
                            example_output = example_output.replace(/{(.*?)}/g, '')
                        }
                    });
                });
            }
        }
        formatoutput({ exp: example_output });

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
    const targetlist = ['noun', 'adverb', 'adjective', 'verb', '<strong>\n\nAd<strong>\n\nVerb</strong></strong>', 'preposition', 'conjunction', 'article', 'pronoun', 'pro<strong>\n\nNoun</strong>', 'exclamation'];
    const replacelist = ['Noun', 'Adverb', 'Adjective', 'Verb', 'Adverb', 'Preposition', 'Conjunction', 'Articles', 'Pronouns', 'Pronouns', 'Exclamation'];
    var chinese_output = ''

    if (query in cndata) {
        chinese_output = cndata[query];
        //formatting
        for (let i = 0; i < targetlist.length; i++) {
            chinese_output = chinese_output.replaceAll(targetlist[i], `<strong>\n\n${replacelist[i]}</strong>`);
        }
        for (let n = 43; n > 0; n--) {
            if (chinese_output.includes(`${n}. `)) {
                chinese_output = chinese_output.replaceAll(`${n}. `, `\n<span> • </span>`);
            }
        }
        if (second) { //lemmatize sucessfully
            formatoutput({e:`<span class="info">Your query has been lemmatized to "${query}"</span>`})
        }
    }
    else { //query not in cndata
        if (third != false) { //3rd time error --> translate
            third = '<strong>Google translated (inaccurate)</strong>\n' + third
            return formatoutput({cn:third, q:query, second:englishlemmatize, e:`<span class="info">Translation accuracy not guaranteed.</span>`});
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

function formatoutput({ en = '', cn = '', q = '', second = false, e = '', t = '', exp =''}) {
    // console.table({ en: en, cn: cn ,e:e, t:t});
    if (e != '') {
        document.getElementById("phonetic").innerHTML = (second) ? `<span class="error">did you mean: ${q}</span>\n${e}` : e
    }
    document.getElementById("definition").innerHTML = (en != '') ? en : document.getElementById("definition").innerHTML;
    document.getElementById("chinese").innerHTML = (cn != '') ? cn : document.getElementById("chinese").innerHTML;
    document.getElementById("example").innerHTML =  (exp!= '') ? exp : document.getElementById("example").innerHTML;
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



