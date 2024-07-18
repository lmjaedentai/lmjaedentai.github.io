function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
}
// function to toggle between light and dark theme

// function toggleTheme() {
//     if (localStorage.getItem('theme') === 'theme-dark') {
//         setTheme('theme-light');
//     } else {
//         setTheme('theme-dark');
//     }
// }

function redirectto(name){
    // window.open(`./search.html`,'_self')
    location.href = './search.html'
    setTheme(`${name}-theme`);
}