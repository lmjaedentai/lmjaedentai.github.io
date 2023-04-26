console.warn("\n" +"                       _oo0oo_\n" +"                      o8888888o\n" +"                      88\" . \"88\n" +"                      (| -_- |)\n" +"                      0\\  =  /0\n" +"                    ___/`---'\\___\n" +"                  .' \\\\|     |// '.\n" +"                 / \\\\|||  :  |||// \\\n" +"                / _||||| -:- |||||- \\\n" +"               |   | \\\\\\  -  /// |   |\n" +"               | \\_|  ''\\---/''  |_/ |\n" +"               \\  .-\\__  '-'  ___/-. /\n" +"             ___'. .'  /--.--\\  `. .'___\n" +"          .\"\" '<  `.___\\_<|>_/___.' >' \"\".\n" +"         | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |\n" +"         \\  \\ `_.   \\_ __\\ /__ _/   .-` /  /\n" +"     =====`-.____`.___ \\_____/___.-`___.-'=====\n" +"                       `=---='\n" +"\n" +"\n" +"     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" +"\n" +"                菩提本无树   明镜亦非台\n" +"                本来无BUG    何必常修改\n");

function getquery() {  
  var query = document.getElementById("searchbar").value;
  if (query == ''|| !/^[a-zA-Z()]*$/.test(query.trim())) { //is alpha
    window.alert("invalid input");
  }
  else {
    searchquery(query);
  }
    
}

function searchquery(query, second = false){
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then((response) => response.json())
    .then(function (raw) {
      document.getElementById("searchtitle").innerHTML = `📘 ${query}`;
      processquery(raw, query, second);
    });
}

function processquery(raw, search, second = false) {
  if (second) {
    var output = `\n\n❓do you mean:  ${search}`;
  }
  else {
    var output = '';
  }
  let n = 0;

  //QQ formatting
  for (let result in raw) {
    for (let a in raw[result]["meanings"]) {
      output += `\n\n${raw[result]["meanings"][a]["partOfSpeech"]}`;
      for (definition in raw[result]["meanings"][a]["definitions"]) {
        n += 1;
        output += `\n ${n}. ${raw[result]["meanings"][a]["definitions"][definition]['definition']}`;
      }
    }
  }

  //QQ error handling
  if (output === undefined || output == "") { 
    if (second == false) {
      //QQ autocorrect
      fetch(`https://dictionaryapi.com/api/v3/references/learners/json/${search}?key=5109265c-d6b4-4c53-950f-530a5c8c9658`)
      .then((response) => response.json())
      .then(function (autocorrect) {
        if (!autocorrect || autocorrect.length === 0 || autocorrect===undefined) {
          return document.getElementById("result").innerHTML = `❌ No Result.  Try <a href="https://www.google.com/search?q=define+${search}">Google.</a><br><img src="https://http.cat/404">`
        }
        if (autocorrect[0].hasOwnProperty('meta')) {
          return document.getElementById("result").innerHTML =`\n👉🏻  refer <a href="https://www.merriam-webster.com/dictionary/${search}">Meriam Webster</a>`
        }
        else {
          searchquery(autocorrect[1],true);
        }
      })
    }
    else {
      return document.getElementById("result").innerHTML = `❌ No Result.  Try <a href="https://www.google.com/search?q=define+${search}">Google.</a><br><img src="https://http.cat/404">`
    }
  }

  output = output.replaceAll("(", "<i>(");
  output = output.replaceAll(")", ")</i>");
  output = output.replace("\n", "");
  document.getElementById("result").innerHTML = output + chinesequery(search);
  chinesequery(search,output)
}


//QQ bingqiling
function chinesequery(query, output,second = false) {
  const targetlist = ['noun', 'adverb', 'adjective', 'verb', 'Ad\n\nVerb: : ', 'preposition', 'conjunction', 'article', 'pronoun', 'pro\n\nNoun: ', 'exclamation'];
  const replacelist = ['\n\nNoun: ', '\n\nAdverb:', '\n\nAdjective: ', '\n\nVerb: ', 'Adverb: ', '\n\nPreposition: ', '\n\nConjunction: ', '\n\nArticles: ', '\n\nPronouns: ', '\n\nPronouns: ', '\n\nExclamation: '];
  var meaning = ''

  if (query in cndata) {
    meaning = cndata[query]
    for (let i = 0; i<targetlist.length; i++){
      meaning = meaning.replaceAll(targetlist[i],replacelist[i])
    }
    for (let n = 43; n >=1; n--){
      if (meaning.includes(`${n}. `)) {
        meaning = meaning.replaceAll(`${n}. `, `\n${n}. `);
      }
    }
    meaning = meaning.replace(`.`, `. `)
  }
  else {
    if (second) {
      meaning =''
    }
    else {
      fetch(`https://dictionaryapi.com/api/v3/references/learners/json/${query}?key=5109265c-d6b4-4c53-950f-530a5c8c9658`)
      .then((response) => response.json())
      .then(autocorrect => {
        if (!autocorrect || autocorrect.length === 0 || autocorrect===undefined) {
          meaning ='';
        }
        if (autocorrect[0].hasOwnProperty('meta')) {
          var searchpure = autocorrect[0]["meta"]["stems"][0];
          meaning = chinesequery(searchpure, output, second = true);
        }
        else {
          var searchpure = autocorrect[1];
          meaning = chinesequery(autocorrect[1], output);
        }
      });
    }
  }
  document.getElementById("result").innerHTML = output +meaning;
}


//QQ ui functions
function clearInput(){  
  document.getElementById("searchbar").value= "";
}

var wage = document.getElementById("searchbar");
wage.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
      getquery()
    }
});





// const translate = require('google-translate-api');

// translate('Ik spreek Engels', {to: 'en'}).then(res => {
//     console.log(res.text);
//     //=> I speak English
//     console.log(res.from.language.iso);
//     //=> nl
// }).catch(err => {
//     console.error(err);
// });