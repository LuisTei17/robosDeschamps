const fs = require('fs'),
    contentFilePath = './content.json';

function save (content) {
    fs.writeFileSync(contentFilePath, JSON.stringify(content));
    return contentFilePath;
}

function load () {
    const content = fs.readFileSync(contentFilePath);

    return JSON.parse(content);
}

module.exports = {
    save,
    load
};
