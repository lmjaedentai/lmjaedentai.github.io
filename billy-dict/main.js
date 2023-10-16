console.warn("\n" + "                       _oo0oo_\n" + "                      o8888888o\n" + "                      88\" . \"88\n" + "                      (| -_- |)\n" + "                      0\\  =  /0\n" + "                    ___/`---'\\___\n" + "                  .' \\\\|     |// '.\n" + "                 / \\\\|||  :  |||// \\\n" + "                / _||||| -:- |||||- \\\n" + "               |   | \\\\\\  -  /// |   |\n" + "               | \\_|  ''\\---/''  |_/ |\n" + "               \\  .-\\__  '-'  ___/-. /\n" + "             ___'. .'  /--.--\\  `. .'___\n" + "          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" + "         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" + "         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" + "     =====`-.____`.___ \\_____/___.-`___.-'=====\n" + "                       `=---='\n" + "\n" + "\n" + "     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + "\n" + "                菩提本无树   明镜亦非台\n" + "                本来无BUG    何必常修改\n");
document.getElementById("searchbar").focus();
var englishlemmatize = false;


function getquery() {
  var query = document.getElementById("searchbar").value.toLowerCase().trim();
  if (query == '') {
    return //console.log('empty input')
  }
  if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
    return document.getElementById("result").innerHTML = `<img src="https://http.cat/405">\nOnly alphabetic characters are acceptable.`
  }
  else {
    document.getElementById("result").innerHTML = `<img src="https://http.cat/102">`
    searchquery(query);
  }
}

function searchquery(query, second = false){
  fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${query}?key=fea702b3-bccf-47c3-b29e-2293789b70af`)
    .then((response) => response.json())
    .then(function (raw) {
      if (second == false) {
        document.getElementById("searchtitle").innerHTML = `📘 ${query}`;
      }
      // console.warn('i start my job')
      formatoutput(englishdef(raw, query, second),chinesedef(query,raw),query,second);
    });
}

function englishdef(raw, search, second = false) {
  var english_output = '\n\n';
  let block = true;
  let n = 1;

  //QQ error handling
  if (raw === undefined || raw == "" ||raw[0].hasOwnProperty('meta') == false) {
    if (second == false) {
      if (!raw || raw.length === 0 || raw===undefined) {
        return document.getElementById("result").innerHTML = `<img src="https://http.cat/404"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
      }
      else { //autocorrect
        englishlemmatize = true;
        searchquery(raw[0].toLowerCase().trim(),true);
        console.table(raw);
      }
    }
    else { //second time
      return document.getElementById("result").innerHTML = `<img src="https://http.cat/404"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
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
          english_output += `\n\n<u>${raw[elements]['fl']}</u>`; //print part of speech
          for (definitions in raw[elements]["shortdef"]) {
            english_output += `\n<span class="grey">${n}.</span> ${raw[elements]["shortdef"][definitions]}`;
            n++
          }
          // console.log(raw[elements]['fl'], raw[elements]["shortdef"].length);
          // console.table(raw[elements]["shortdef"]);
        }
      }
      if (raw[elements].hasOwnProperty('art')) { //print img
        english_output += `\n\n<img src="https://www.merriam-webster.com/assets/mw/static/art/dict/${raw[elements]['art']['artid']}.gif">\n`;
      }
      if (raw[elements]["meta"]["offensive"] && block) { //offensive
        if (window.confirm("The word is offensive. Do you wish to proceed?")) {
          block = false;
        }
        else {
          return document.getElementById("result").innerHTML = `<img src="https://http.cat/450"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
        }
      }
    }

    if (english_output == '' || english_output===undefined) { //no result but merriam give another word
      return document.getElementById("result").innerHTML = `<img src="https://http.cat/204"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
    }
    else { //formatting
      english_output = english_output.replaceAll("(", "<i class='grey'>(");
      english_output = english_output.replaceAll(")", ")</i>");
      english_output = english_output.replace("\n\n\n", "\n\n<hr>");
      return english_output
    }
  }
}

//QQ bingqiling
function chinesedef(query, englishraw, second = false, third = false) {
  const targetlist = ['noun', 'adverb', 'adjective', 'verb', 'Ad\n\nVerb: : ', 'preposition', 'conjunction', 'article', 'pronoun', 'pro\n\nNoun: ', 'exclamation'];
  const replacelist = ['\n\nNoun: ', '\n\nAdverb:', '\n\nAdjective: ', '\n\nVerb: ', 'Adverb: ', '\n\nPreposition: ', '\n\nConjunction: ', '\n\nArticles: ', '\n\nPronouns: ', '\n\nPronouns: ', '\n\nExclamation: '];
  var chinese_output = ''

  if (query in cndata) {
    chinese_output = cndata[query];
    //formatting
    for (let i = 0; i < targetlist.length; i++) {
      chinese_output = chinese_output.replaceAll(targetlist[i], replacelist[i]);
    }
    for (let n = 43; n > 0; n--) {
      if (chinese_output.includes(`${n}. `)) {
        chinese_output = chinese_output.replaceAll(`${n}. `, `\n<span class="grey">${n}.</span>`);
      }
    }
    if (second) { //lemmatize sucessfully
      chinese_output = `\n\n<span class="info">🔄️ Your query has been lemmatized to "${query}"</span>` + chinese_output
    }
  }
  else { //query not in cndata
    if (third != false) { //3rd time error --> translate
      third = '<u class="grey">Google translated</u>\n' + third +`\n\n<span class="info">🔤 Translation accuracy not guaranteed.</span>`
      console.table({searchinput:query,english:englishraw, translated: third ,en_second_trial:englishlemmatize})
      return formatoutput(englishdef(englishraw, query, second), third, query,englishlemmatize);
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
        console.table({ lemmatize: chinese_output })
        return chinesedef(searchpure, englishraw, second = true);
      } 
    }
  }
  chinese_output = chinese_output.replaceAll(`；`, `<span class="grey">；</span>`);
  chinese_output = chinese_output.replace(`\n\n`, `\n`);
  // console.table({return_normal: chinese_output})
  return chinese_output;
}

async function translatedef(query,englishraw) { //test: hetero
  const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-TW&dt=t&q=${encodeURI(query)}`)
  .then((response) => response.json())
    .then(function (translated_output) {
    console.log(translated_output[0][0][0])
    return chinesedef(query,englishraw, true, translated_output[0][0][0])
  });
}

function formatoutput(english_output, chinese_output,search,second) {
  // console.table({ en: english_output, cn: chinese_output });
  if(second){
    chinese_output = `<span class="error">❓did you mean:   <strong>${search}</strong></span>\n\n` + chinese_output;
  }
  document.getElementById("result").innerHTML = chinese_output + english_output;
  // console.warn('i end my job')
  clearInput();
}




//QQ ui functions
function clearInput(){
  document.getElementById("searchbar").value = "";
  // document.getElementById("searchbar").focus();
}

var form = document.getElementById("searchform");
function handleForm(event) {
  event.preventDefault();
  getquery();
}
form.addEventListener('submit', handleForm);


//QQ beta

