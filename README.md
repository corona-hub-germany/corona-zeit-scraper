# corona-zeit-scraper

Scrape corona case-data from [interactive.zeit.de](https://www.zeit.de/wissen/gesundheit/coronavirus-echtzeit-karte-deutschland-landkreise-infektionen-ausbreitung) and provides the data as an API.

## Serverless

You can depoy a serverless function:

```sh
serverless deploy
```

You'll need to set a few environment-variables to recieve error messages from the telegram corona-serverless-error-bot:

* TELEGRAM_BOT_TOKEN
* TELEGRAM_CHAT_ID

Here is an example endpoint you can use:

https://t1d4vowz6c.execute-api.eu-central-1.amazonaws.com/dev/getCoronaDataGermany

## API Example

```js
const ZeitCoronaGermanyDataScraper = require('corona-zeit-scraper');
	
const scraper = new ZeitCoronaGermanyDataScraper();
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

console.log(returnJson);
```

Output:
```js
{
	"srcUrl": "https://interactive.zeit.de/cronjobs/2020/corona/germany.json",
	"copyright": "Quelle: Kreis- und Landesbehörden",
	"lastUpdate": "2020-04-07T19:38:05.000Z",
	"data": [
		{
			"name": "Flensburg, Stadt",
			"ags": "01001",
			"infected": 31,
			"dead": 1,
			"recovered": 10
		},
		...
	]
}
```