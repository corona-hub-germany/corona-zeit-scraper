const ZeitCoronaGermanyDataScraper = require('../src/ZeitCoronaGermanyDataScraper');

(async () => {
	const scraper = new ZeitCoronaGermanyDataScraper({
		useFileCache: true
	});

	await scraper.loadPage();

	const data = scraper.getEntries();
	data.forEach(d => {
		console.log(`${d.name} (${d.ags}): infected:${d.infected}, dead:${d.dead}, recovered:${d.recovered}`);
	});
})()