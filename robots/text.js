const algorithmia = require('algorithmia'),
    algoCred = require('./../credentials/algorithimia.json');

async function robot (content) {
    await fetchContentFromWikipedia(content);
    //     sanitizedContent = sanitizeContent(originalSourceContent);

    // breakContentIntoSentences(sanitizedContent);

    async function fetchContentFromWikipedia (content) {
        const algorithmiaAuthenticated = algorithmia(algoCred.apiKey),
            wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2'),
            wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm),
            wikipediaContent = wikipediaResponse.get();

        content.originalSourceContent = wikipediaContent.content;

    }
};

module.exports = robot;