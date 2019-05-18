const readline = require('readline-sync');

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
        'searchTerm': askAndReturnSearchTerm(),
        'prefix': askAndReturnSearchPrefix()
    };

    return content;
};

module.exports = robot;