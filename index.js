const robots = {
    'userInput': require('./robots/input.js'),
    'text': require('./robots/text.js'),
    'file': require('./robots/file')
};

async function start () {
    robots.userInput();
    await robots.text();

    const savedContent = robots.file.load();

    console.dir(savedContent, { depth: null });
}

start();