'use strict';

const ZeitCoronaGermanyDataScraper = require('./src/ZeitCoronaGermanyDataScraper');
const telegramSendMessage = require('./src/telegramSendMessage');

module.exports.getCoronaDataGermany = async (event, context, callback) => {
	try {
		const scraper = new ZeitCoronaGermanyDataScraper({
			useFileCache: false
		});

		await scraper.loadPage();

		const srcUrl = scraper.getSourceUrl();
		const copyright = scraper.getCopyright();
		const lastUpdate = scraper.getLastUpdate();
		const data = scraper.getEntries();

		const returnJson = {
			srcUrl,
			copyright,
			lastUpdate,
			data
		}

		return {
			statusCode: 200,
			body: JSON.stringify(returnJson, null, 2),
		};

	} catch (err) {
		telegramSendMessage(`Error in getCoronaDataGermany : ${err}`);
		return {
			statusCode: 500,
			body: JSON.stringify(err)
		};
	}
};
