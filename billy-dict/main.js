console.log("start")

function getquery() {  
  var query = document.getElementById("searchbar").value
  if (query == ''|| !/^[a-zA-Z()]*$/.test(query)) { //is alpha
    window.alert("invalid input");
  }
  else {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`)
    .then((response) => response.json())
    .then(function (data) {
      processquery(data);
      document.getElementById("searchtitle").innerHTML = query;
    })
  }
}


function processquery(raw,second=false){
  var output = '';
  let n = 0;

  for (let result in raw) {
    for (let a in raw[result]["meanings"]) {
      output += `\n\n${raw[result]["meanings"][a]["partOfSpeech"]}`;
      for (definition in raw[result]["meanings"][a]["definitions"]) {
        n += 1;
        output += `\n ${n}. ${raw[result]["meanings"][a]["definitions"][definition]['definition']}`;
      }
    }
  }
  if (output === undefined || output == "") { //error handling
    if (second == false) {
      //TODO autocorrect
      return document.getElementById("result").innerHTML = "no result";
    }else {
      return document.getElementById("result").innerHTML = "no result";
    }
  }

  



  output = output.replaceAll("(", "<i>(");
  output = output.replaceAll(")", ")</i>");
  document.getElementById("result").innerHTML =output;
}

//TODO bingqiling
//LINK https://github.com/takafumir/javascript-lemmatizer

function clearInput(){  
  document.getElementById("searchbar").value= "";
}

var wage = document.getElementById("searchbar");
wage.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        getquery()
    }
});