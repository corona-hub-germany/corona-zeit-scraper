const fs = require('fs-extra');
const axios = require('axios').default;
const moment = require('moment');
const { getDistrictByAGS } = require('./districtData');

module.exports = class ZeitCoronaGermanyDataScraper {

	constructor(options) {
		this.options = Object.assign({
			url: 'https://interactive.zeit.de/cronjobs/2020/corona/germany.json',
			useFileCache: false
		}, options );
	}

	async loadPage() {
		const CACHE_FILE = './.cache.json';

		if (this.options.useFileCache && fs.existsSync(CACHE_FILE)) {
			this.content = await fs.readFile(CACHE_FILE);
		} else {
			try {
				var response = await axios.get(this.options.url, {});
				this.content = response.data;
			} catch(err) {
				throw new Error(`Error requesting remote url "${this.options.url}": ${err}`);
			}

			if (this.options.useFileCache) {
				await fs.writeFile(CACHE_FILE, this.content);
			}
		}
	}

	getSourceUrl() {
		return this.options.url;
	}

	getCopyright() {
		return 'Quelle: Kreis- und Landesbehörden';
	}

	getLastUpdate() {
		const dateTime = moment(this.content.lastUpdate);
		if (!dateTime.isValid()) {
			throw new Error(`Could not find date-time.`);
		}
		return dateTime.toISOString();
	}

	getEntries() {
		var data = [];

		const counties = this.content.kreise.items;
		for (const county of counties) {
			const AGS = county.ags.padStart(5, '0');
			const district = getDistrictByAGS(AGS);
			if (!district) {
				throw new Error(`Could not find district with AGS "${AGS}"`);
			}
			const currentStats = county.currentStats;
			const entry = {
				name: district.name,
				ags: AGS,
				infected: currentStats.count,
				dead: currentStats.dead,
				recovered: currentStats.recovered
			};
			data.push(entry);
		}
		return data;
	}

}