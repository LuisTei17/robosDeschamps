const readline = require('readline-sync');

function start () {
    const content = {};

    content.searchTerm = askAndReturnSearchTerm();
    content.prefix = askAndReturnSearchPrefix();

    function askAndReturnSearchTerm () {
        return readline.question('What do you want to search?\n');
    }

    function askAndReturnSearchPrefix () {
        const prefixes = ['What is', 'Who is', 'The history of'],
            selectedPrefixIndex = readline.keyInSelect(prefixes, 'Choose a prefix'),
            prefixSelected = prefixes[selectedPrefixIndex];

        return prefixSelected;
    }

}

start();