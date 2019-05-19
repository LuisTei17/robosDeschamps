const file = require('./file'),
    google = require('googleapis').google,
    customSearch = google.customsearch('v1'),
    googleApiCred = require('./../credentials/google-search.json');

async function robots () {
    const content = file.load();

    for (const sentence of content.sentences) {
        const query = `${content.searchTerm} ${sentence.keyWords[0]}`;
        sentence.images = await fetchImageUrls(query);

        sentence.googleSearchQuery = query;
    }

    console.dir(content, {depth: null});

    async function fetchImageUrls (query) {
        const response = await customSearch.cse.list({
            auth: googleApiCred.apikey,
            cx: googleApiCred.searchEngineId,
            q: query,
            searchType: 'image',
            num: 2
        });
        if (response.data && response.data.items)
            return response.data.items.map((item) => item.link);
        return [];
    }
}

module.exports = robots;