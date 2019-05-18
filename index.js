const robots = {
    'userInput': require('./robots/input.js'),
    'text': require('./robots/text.js')
};

async function start () {
    const content = robots.userInput();
    content.maximumSentences = 7;

    await robots.text(content);

    console.log(JSON.stringify(content, null, 4));
}

start();