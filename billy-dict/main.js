console.warn("\n" +"                       _oo0oo_\n" +"                      o8888888o\n" +"                      88\" . \"88\n" +"                      (| -_- |)\n" +"                      0\\  =  /0\n" +"                    ___/`---'\\___\n" +"                  .' \\\\|     |// '.\n" +"                 / \\\\|||  :  |||// \\\n" +"                / _||||| -:- |||||- \\\n" +"               |   | \\\\\\  -  /// |   |\n" +"               | \\_|  ''\\---/''  |_/ |\n" +"               \\  .-\\__  '-'  ___/-. /\n" +"             ___'. .'  /--.--\\  `. .'___\n" +"          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" +"         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" +"         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" +"     =====`-.____`.___ \\_____/___.-`___.-'=====\n" +"                       `=---='\n" +"\n" +"\n" +"     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" +"\n" +"                菩提本无树   明镜亦非台\n" +"                本来无BUG    何必常修改\n");

function getquery() {  
  var query = document.getElementById("searchbar").value.toLowerCase().trim();
  if (query == '') {
    return console.log('fk')
  } 
  if (!/^[A-Za-z\s]*$/.test(query.trim())) { //is not alpha
    return document.getElementById("result").innerHTML = `<img src="https://http.cat/400">`
  }
  else {
    searchquery(query);
  }
}


function searchquery(query, second = false){
  fetch(`https://dictionaryapi.com/api/v3/references/collegiate/json/${query}?key=fea702b3-bccf-47c3-b29e-2293789b70af`)
    .then((response) => response.json())
    .then(function (raw) {
      document.getElementById("searchtitle").innerHTML = `📘 ${query}`;
      processquery(raw, query, second);
    });
}

function processquery(raw, search, second = false) {
  if (second) {
    var english_output = `\n\n\n\n<img src="https://http.cat/303">\n\n<span class="error">❓do you mean:  ${search}</span>`;
  }
  else {
    var english_output = '\n\n';
  }
  let n = 0;
  let block = true;


  //QQ error handling
  if (raw === undefined || raw == "" ||raw[0].hasOwnProperty('meta') == false) { 
    if (second == false) {
      if (!raw || raw.length === 0 || raw===undefined) {
        return document.getElementById("result").innerHTML = `<img src="https://http.cat/404"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
      }
      else { //autocorrect
        console.table(raw);
        searchquery(raw[0].toLowerCase().trim(),true);
      }
    }
    else { //second time
      return document.getElementById("result").innerHTML = `<img src="https://http.cat/404"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
    }
  }
  else { //no error
    for (let elements in raw) { //print def
      if (raw[elements]["hwi"]["hw"] == search || raw[elements]["meta"]["id"] == search || raw[0]["meta"]["stems"][0].toLowerCase() == search || raw[elements]["hwi"]["hw"] == raw[0]["meta"]["stems"][0] || raw[elements]["meta"]["id"] == raw[0]["meta"]["stems"][0] ) {
        english_output += `\n\n<u>${raw[elements]['fl']}</u>`;
        for (definitions in raw[elements]["shortdef"]) {
          n += 1;
          english_output += `\n<span class="grey">${n}.</span> ${raw[elements]["shortdef"][definitions]}`;
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
      return document.getElementById("result").innerHTML = `<img src="https://http.cat/410"><br>Try <a href="https://www.google.com/search?q=define+${search}" target="_blank">Google.</a>`
    }
    else {
      english_output = english_output.replaceAll("(", "<i class='grey'>(");
      english_output = english_output.replaceAll(")", ")</i>");
      english_output = english_output.replace("\n\n\n\n", "\n\n<hr>\n");
      chinesequery(search,english_output,raw)
    }
  }  
}


//QQ bingqiling
function chinesequery(query, english_output, raw, second = false) {
  const targetlist = ['noun', 'adverb', 'adjective', 'verb', 'Ad\n\nVerb: : ', 'preposition', 'conjunction', 'article', 'pronoun', 'pro\n\nNoun: ', 'exclamation'];
  const replacelist = ['\n\nNoun: ', '\n\nAdverb:', '\n\nAdjective: ', '\n\nVerb: ', 'Adverb: ', '\n\nPreposition: ', '\n\nConjunction: ', '\n\nArticles: ', '\n\nPronouns: ', '\n\nPronouns: ', '\n\nExclamation: '];
  var chinese_output = ''

  if (query in cndata) {
    chinese_output = cndata[query];
    //formatting
    for (let i = 0; i<targetlist.length; i++){
      chinese_output = chinese_output.replaceAll(targetlist[i], replacelist[i]);
    }
    for (let n = 43; n > 0; n--){
      if (chinese_output.includes(`${n}. `)) {
        chinese_output = chinese_output.replaceAll(`${n}. `, `\n<span class="grey">${n}.</span>`);
      }
    }
  }
  else { //query not in cndata
    if (second) {
      chinese_output = ''; //TODO translate
    }
    else { //first time error
      if (!raw || raw.length === 0 || raw === undefined) { //404
        chinese_output =''; 
      }
      if (raw[0].hasOwnProperty('meta')) {
        var searchpure = raw[0]["meta"]["stems"][0]; //lemmatize the word
        return chinesequery(searchpure, english_output, raw,second = true);
      } //else is autocorrect but not apply here, will change query for only cn
    }
  }
  chinese_output = chinese_output.replaceAll(`；`, `<span class="grey">；</span>`);
  chinese_output = chinese_output.replace(`\n\n`, `\n`);
  document.getElementById("result").innerHTML = chinese_output + english_output;
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