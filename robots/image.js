const file = require('./file'),
    google = require('googleapis').google,
    customSearch = google.customsearch('v1'),
    googleApiCred = require('./../credentials/google-search.json'),
    imageDownloader = require('image-downloader');

async function robots () {
    const content = file.load();

    for (const sentence of content.sentences) {
        const query = `${content.searchTerm} ${sentence.keyWords[0]}`;
        sentence.images = await fetchImageUrls(query);

        sentence.googleSearchQuery = query;
    }

    await downloadAllImages(content);

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

    async function downloadAllImages (content) {
        const imagesDownloaded = [];

        for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
            const images = content.sentences[sentenceIndex].images;

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                try {
                    const imageUrl = images[imageIndex],
                        imageAlreadyDownloaded = imagesDownloaded.includes(imageUrl);

                    if (imageAlreadyDownloaded)
                        throw new Error('Image already downloaded');

                    await downloadAndSaveImage(imageUrl, `${sentenceIndex}-image.png`);

                    imagesDownloaded.push(imageUrl);
                    console.log(`image: ${imageUrl} downloaded successfully!!!`);
                    break;
                } catch (error) {
                    console.log(`ERROR: ${error}`);
                }
            }
        }
    }

    async function downloadAndSaveImage (url, _fileName) {
        return imageDownloader.image({
            url: url,
            dest: `./content/${_fileName}`
        });
    }
}

module.exports = robots;