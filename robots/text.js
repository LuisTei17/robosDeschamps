const algorithmia = require('algorithmia'),
    algoCred = require('./../credentials/algorithimia.json'),
    watsonNlu = require('./../credentials/watson-nlu.json'),
    sentenceBoundaryDetection = require('sbd'),
    NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js'),
    file = require('./file');

async function robot () {
    const content = file.load();

    await fetchContentFromWikipedia(content);
    sanitizeContent(content);
    breakContentIntoSentences(content);
    getMaximumSentences(content);
    await fetchKeywordsOfAllSentences(content);

    file.save(content);
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

    function getMaximumSentences (content) {
        content.sentences = content.sentences.slice(0, content.maximumSentences);
    }

    async function fetchKeywordsOfAllSentences (content) {
        for (let sentence of content.sentences)
            sentence.keyWords = await getKeyWordsByText(sentence.text);
    }

    async function getKeyWordsByText (text) {
        const nlu = new NaturalLanguageUnderstandingV1({
            iam_apikey: watsonNlu.apikey,
            version: '2018-04-05',
            url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
        });
        return new Promise((resolve, reject) => {
            nlu.analyze({
                text: text,
                features: {
                    keywords: {}
                }
            }, function (err, response) {
                if (err)
                    return reject(err);
                if (response && response.keywords)
                    return resolve(response.keywords.map(resp => resp.text));
                return reject(new Error('Invalid object'));
            });
        });
    }
};

module.exports = robot;