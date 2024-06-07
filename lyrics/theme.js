document.getElementById('searchinput').addEventListener('focus', function(){
    document.getElementById('searchbar').style.borderRadius = "10px";
    document.getElementById('searchbar').style.width = "300px";
    document.getElementById('searchbar').style.overflow = "visible";
});


document.getElementById('searchbar').addEventListener('hover', function(){
    document.getElementById('searchinput').focus();
    document.getElementById('searchbar').style.borderRadius = "10px";
    document.getElementById('searchbar').style.width = "300px";
    document.getElementById('searchbar').style.overflow = "visible";
});

function openinfo() {
    document.getElementById('infobox').style.width = "80%";
    document.getElementById('infobox').style.visibility = "visible";
}

function closeinfo() {
    document.getElementById('infobox').style.width = "0px";
    document.getElementById('infobox').style.visibility = "hidden";
}