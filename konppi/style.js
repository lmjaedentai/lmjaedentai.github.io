function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}

function redirectto(name){
    // window.open(`./search.html`,'_self')
    location.href = './search.html'
    setTheme(`${name}-theme`);
}

function redirecthome(name){
    location.href = './index.html'
    document.getElementById("searchbar").focus();
    document.getElementById('menu').scrollIntoView({behavior: 'smooth'});
}


function openwiki() {
    window.open(`https://www.youtube.com/results?search_query=${query}`,'_blank');
}
function opengoogle() {
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
}
function opendict() {
    window.open(`https://www.oxfordlearnersdictionaries.com/definition/english/${query}`, '_blank');
}