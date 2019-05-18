const algorithmia = require('algorithmia'),
    algoCred = require('./../credentials/algorithimia.json'),
    sentenceBoundaryDetection = require('sbd');

async function robot (content) {
    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);

    async function fetchContentFromWikipedia (content) {
        const algorithmiaAuthenticated = algorithmia(algoCred.apiKey),
            wikipediaAlgorithm = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2'),
            wikipediaResponse = await wikipediaAlgorithm.pipe(content.searchTerm),
            wikipediaContent = wikipediaResponse.get();

        content.originalSourceContent = wikipediaContent.content;

    }

    function sanitizeContent (content) {
        const textWithoutBlankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.originalSourceContent);
        content.sanitizedSourceContent = textWithoutBlankLinesAndMarkdown.join(' ');
        function removeBlankLinesAndMarkdown (text) {
            const allLines = text.split('\n'),
                withoutBlankLines = allLines.filter(line => line.trim().length && !line.trim().startsWith('='));

            return withoutBlankLines;
        }
    }

    function breakContentIntoSentences (content) {
        const sentences = sentenceBoundaryDetection.sentences(content.sanitizedSourceContent);

        content.sentences = [];

        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keyWords: [],
                images: []
            });
        });
    }
};

module.exports = robot;