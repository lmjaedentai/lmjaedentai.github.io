const contentArea = document.getElementById('content');

async function loadContent(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        
        const markdownText = await response.text();
        
        // Convert the Markdown text to HTML using marked.js
        const htmlContent = marked.parse(markdownText);
        
        // Inject the generated HTML into the main content area
        contentArea.innerHTML = htmlContent;
        
    } catch (error) {
        contentArea.innerHTML = `<h2>Error</h2><p>${error.message}</p>`;
        console.error(error);
    }
}

// Initial content load when the page first loads
document.addEventListener('DOMContentLoaded', () => {
    loadContent('posts/post-1.md');
});