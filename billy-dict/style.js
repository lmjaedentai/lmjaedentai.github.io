function setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
    updateMetaThemeColor(themeName);
}

function updateMetaThemeColor(themeName) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        if (themeName === 'theme-dark') {
            metaThemeColor.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--white-primary').trim());
        } else {
            metaThemeColor.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--white-primary').trim());
        }
    }
}

// Function to toggle between light and dark theme
function toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-light');
    } else {
        setTheme('theme-dark');
    }
}

// Immediately invoked function to set the theme on initial load
(function () {
    if (localStorage.getItem('theme') === 'theme-dark') {
        setTheme('theme-dark');
    } else {
        setTheme('theme-light');
    }
})();