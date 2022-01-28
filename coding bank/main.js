document.body.contentEditable=false;
// main
function search(event) {
  let searchstring = document.getElementById('searchbar').value;
  searchstring = searchstring.toLowerCase();
  let searchvalue = document.getElementsByTagName('h2');

  document.getElementById('intro').style.display = 'none';
  for (i = 0; i < searchvalue.length; i++) { 
    if (!searchvalue[i].innerHTML.toLowerCase().includes(searchstring)) {
      searchvalue[i].parentElement.style.display = "none";
    }
    else {
      document.getElementById('searchresultpadding').style.padding = '20px';
      searchvalue[i].parentElement.style.display = "block"; 
    }
  }  
  if(searchstring != searchvalue){
    document.getElementById('searchresultpadding').style.padding = '0px';
    searchvalue[i].parentElement.style.display = "block";
    if(searchstring == ''){
      document.getElementById('intro').style.display = 'block';
    }
  }
}


// style
function liked(){
  document.getElementById('hearticon').style.color = "red";
}

function shared(){
  document.getElementById('shareicon').style.color = "rgb(0, 255, 115)";
} 