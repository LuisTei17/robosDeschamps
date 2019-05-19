const robots = {
    'userInput': require('./robots/input.js'),
    'text': require('./robots/text.js'),
    'file': require('./robots/file.js'),
    'image': require('./robots/image.js')
};

async function start () {
//    robots.userInput();
//    await robots.text();
    await robots.image();

    const savedContent = robots.file.load();
}

start();