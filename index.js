const robots = {
    'userInput': require('./robots/input.js'),
    'text': require('./robots/text.js')
};

async function start () {
    const content = robots.userInput();
    await robots.text(content);
}

start();