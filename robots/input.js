const readline = require('readline-sync'),
    file = require('./file');

function askAndReturnSearchTerm () {
    return readline.question('What do you want to search?\n');
}

function askAndReturnSearchPrefix () {
    const prefixes = ['What is', 'Who is', 'The history of'],
        selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose a prefix'),
        prefixSelected = prefixes[selectedPrefixIndex];

    return prefixSelected;
}

function robot () {
    const content = {
        'maximumSentences':  7,
        'searchTerm': askAndReturnSearchTerm(),
        'prefix': askAndReturnSearchPrefix()
    };
    file.save(content);
    return content;
};

module.exports = robot;