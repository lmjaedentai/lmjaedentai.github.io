console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
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
    document.getElementById("example").innerHTML =''
    document.getElementById("thesaurus").innerHTML = '';
    document.getElementById("etymology").innerHTML = '';
    
    if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
        return document.getElementById("phonetic").innerHTML='<img src="./asset/error.svg"/>\n\nOnly alphabetic characters are acceptable.'
    }
    else {
        searchquery(query);
    }
}

async function searchquery(query, second = false) {
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${query}?key=fea702b3-bccf-47c3-b29e-2293789b70af`)
    raw = await response.json()
    if (second == false) {
        document.getElementById("searchtitle").innerHTML = query;
    }
    await englishdef(raw, query, second)
    
    const response2 = await fetch(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${query}?key=1b547310-00e9-418a-b23f-b73d22906f1c`)
    raw2 = await response2.json()
    thesaurus(raw2, query)
}

async function englishdef(raw, search, second = false, third=false) {
    var english_output = '\n\n';
    var example_output = '';
    var etymology_output = '';
    let block = true;

    //QQ error handling
    if (raw === undefined || raw == "" || raw[0].hasOwnProperty('meta') == false) {
        if (second == false) {
            if (!raw || raw.length === 0 || raw === undefined) {
                document.getElementById("phonetic").innerHTML = '<img src="./asset/error.svg"/>\n\nNo result'; return
            }
            else { //autocorrect
                englishlemmatize = true;
                searchquery(raw[0].toLowerCase().trim(), true);
            }
        }
        else { //second time
            document.getElementById("phonetic").innerHTML = '<img src="./asset/error.svg"/>\n\nNo result'; return
        }
    }
    else { //no error
        for (let elements in raw) { //check if search query available
            if (raw[elements]["hwi"]["hw"].replaceAll("*", "") == search || raw[elements]["meta"]["id"].split(':')[0] == search || raw[elements]["meta"]["stems"].includes(search)) {
                if (raw[elements]["shortdef"].length == 0) {
                    continue; //the definition is unavailable
                }
                else {//QQ print def
                    english_output += `\n<strong>${raw[elements]['fl']}</strong>`; //print part of speech
                    for (definitions in raw[elements]["shortdef"]) {
                        english_output += `<li>${raw[elements]["shortdef"][definitions]}</li> `;
                    }
                }
            }
            if (raw[elements].hasOwnProperty('art')) { //QQ print img
                english_output += `\n<img src="https://www.merriam-webster.com/assets/mw/static/art/dict/${raw[elements]['art']['artid']}.gif">\n`;
            }
            if (raw[elements]["meta"]["offensive"] && block) { //QQ offensive
                if (window.confirm("The word is offensive. Do you wish to proceed?")) {
                    block = false;
                }
                else {
                    formatoutput({ e: '<img src="./asset/error.svg"/>\n\nNo content' }); return
                }
            }
            if (raw[elements].hasOwnProperty('et')) { //QQ etymology
                et = raw[elements]['et'][0][1];
                et = et.replaceAll("{dx_ety}see ", "");
                et = et.replaceAll("{it}", "<i>");
                et = et.replaceAll("{/it}","</i>");
                et = et.replace(/\{[^}]*\}/g, '');
                et = et.replace("\n\n\n", "");
                et = et.replaceAll("+","");
                etymology_output += `${et}\n`;
            }
            if (raw[elements].hasOwnProperty('def')) {//QQ examples
                raw[elements]['def'].forEach(childdef => {
                    if ('sseq' in childdef) {
                        childdef['sseq'].forEach(sseq => {
                            if ('dt' in sseq[0][1]) {
                                sseq[0][1]['dt'].forEach(dt => {
                                    if (dt[0] == 'vis') {
                                        for (i = 1; i < dt.length; i++) {// console.table({'len':dt[i].length,'dti':dt[i]})
                                            for (ii = 0; ii < dt[i].length; ii++) {
                                                if ('t' in dt[i][ii]) {
                                                    example_output += `<blockquote>${dt[i][ii]['t']}</blockquote>\n`;
                                                    example_output = example_output.replace(/\{.*\}/, `<em>${search}</em>`)
                                                }
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            }
        }
        
        
        if (english_output == '' || english_output === undefined) { //no result but merriam give another word
            document.getElementById("phonetic").innerHTML = '<img src="./asset/error.svg"/>\n\nNo content'; return
        }
        else { //formatting
            english_output = english_output.replaceAll("(", "<span>(");
            english_output = english_output.replaceAll(")", ")</span>");
            english_output = english_output.replace("\n\n\n", "");
            english_output = `<ol type='1'>${english_output}</ol>`;
            formatoutput({ exp: example_output, en: english_output, et: etymology_output });
            if (!third) {
                await chinesedef(search, raw, second);
            }
            
        }
    }
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
    else { //query not in cndata
        // if (third != false) { //3rd time error --> translate
        //     third = '<strong>Google translated</strong>\n' + third
            
        // }
        // else 
        if (second) {//2nd try still no result --> third
            chinese_output = await translatedef(query, englishraw);
            chinese_output = '<strong>Google translated</strong>\n' + chinese_output
            return formatoutput({en: await englishdef(englishraw,query,false,true),cn:chinese_output, q:query, second:englishlemmatize, e:`<span class="info">Translation accuracy not guaranteed.</span>`});
        }
        else { //first time error --> lemm
            if (!englishraw || englishraw.length === 0 || englishraw === undefined) { //404 in english
                chinese_output = '';
            }
            if (englishraw[0].hasOwnProperty('meta')) {//else if autocorrect but not apply here, will change query for only cn
                var searchpure = englishraw[0]["meta"]["stems"][0]; //lemmatize the word
                // console.table({replaceplist:englishraw[0]["meta"]["stems"], lemmatize: chinese_output})
                return await chinesedef(searchpure, englishraw, second = true);
            }
        }
    }
    chinese_output = chinese_output.replaceAll(`；`, `<span>；</span>`);
    chinese_output = chinese_output.replaceAll(`(`, `<span>(`);
    chinese_output = chinese_output.replaceAll(`)`, `)</span>`);
    chinese_output = chinese_output.replace(`\n\n`, ``);
    formatoutput({ cn: chinese_output });
}

async function translatedef(query, englishraw) { //test: hetero
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURI(query)}`)
    raw = await response.json()
    return raw[0][0][0];
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
            tableraw += `<td onclick="searchquery('${synonym[i]}')">${synonym[i]}</td>`
        }
        tableraw += '</tr></table>'
        return formatoutput({ t:`${tableraw}</table>`});
        
    }
}

function formatoutput({ en = '', cn = '', q = '', second = false, e = '', t = '', exp ='', et=''}) {
    if (second || e != '') { //e can be info below title or seconndary query
        document.getElementById("phonetic").innerHTML = (second) ? `<span class="error">did you mean: ${q}</span>\n${e}` : e
    }
    //var = (cond) ? new : else_remain
    document.getElementById("definition").innerHTML = (en != '') ? en : document.getElementById("definition").innerHTML;
    document.getElementById("chinese").innerHTML = (cn != '') ? cn : document.getElementById("chinese").innerHTML;
    document.getElementById("thesaurus").innerHTML = (t != '') ? t : document.getElementById("thesaurus").innerHTML;
    document.getElementById("example").innerHTML = (exp != '') ? exp : document.getElementById("example").innerHTML;
    document.getElementById("etymology").innerHTML =  (et!= '') ? et : document.getElementById("etymology").innerHTML;
    clearInput();
    
}

//!QQ searchbar suggestion
const searchbar = document.getElementById("searchbar");
const suggestions = document.getElementById("suggestions");
searchbar.addEventListener("input", function () {
    const query = this.value.toLowerCase();
    suggestions.innerHTML = "";
    if (!query) {
        suggestions.style.display = "none";
        return;
    }


    const matches = Object.keys(cndata)
        .filter(key => /^[a-zA-Z]+$/.test(key) && key.length >= 3 && key !== key.toUpperCase())
        .filter(key => /^[a-zA-Z]+$/.test(key)) // filter only pure alphabetic (no spaces, numbers, or symbols)
        .filter(key => key.toLowerCase().startsWith(query))
        .filter(key => /^[a-zA-Z]+$/.test(key) && key.length >= 4)
        .sort()
        .slice(0, 8);


    if (matches.length > 0) {
        matches.forEach(match => {
            const div = document.createElement("div");
            div.textContent = match;
            div.onclick = () => {
                searchbar.value = match;
                suggestions.style.display = "none";
                document.getElementById("searchbar").focus();
            };
            suggestions.appendChild(div);
        });
        suggestions.style.display = "block";
    } else {
        suggestions.style.display = "none";
    }
});


// function clearInput() {
// searchbar.value = "";
// suggestions.style.display = "none";
// }



//QQ ui functions
function clearInput() {
    document.getElementById("searchbar").value = "";
    document.getElementById("searchbar").focus();
    suggestions.style.display = "none";
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
