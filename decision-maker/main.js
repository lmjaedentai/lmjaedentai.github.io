var result = 'Null';
var delaymsg = ['loading...', 'delay no more', 'buffering', 'cooking', 'thinking', 'generating', 'summoning', 'contempelating', 'processing', 'calculating', 'sleeping', 'u r cute', 'dreaming', 'vomitting', 'cooking', 'loading', 'texting', 'skibiding','idk']
const delay = ms => new Promise(res => setTimeout(res, ms));


const proceedgo = async () => {
    var selectedoption = document.getElementById("select").value;
    document.getElementById("resultlabel").innerHTML = ' ';

    if (selectedoption == 1) { //yea nea
        var i = Math.floor(Math.random() * 2);
        if (i == 1) {
            result = 'yes'
        }
        else {
            result = 'no'
        }
    }
    else {
        const q = prompt("Range");
        result = randomInteger(1, q)
    }
    document.getElementById("quote").innerHTML = await getRandomFact();
    document.getElementById("resultlabel").innerHTML = delaymsg[Math.floor(Math.random() * delaymsg.length)] + '.'.repeat(randomInteger(3,5));
    await delay(randomInteger(3,5)*1000);
    document.getElementById("resultlabel").innerHTML = result;
}

function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function getRandomFact() {
    const url = 'https://uselessfacts.jsph.pl/api/v2/facts/random';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.text;

    }
    catch (error) {
        console.error('Failed to fetch fact:', error);
        return `There's an error with the quote generator, but never mind I'm still here`;
    }
}
