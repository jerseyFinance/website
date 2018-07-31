import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";
var rp = require('request-promise');

var DAILY_PRICE_URL =  'http://35.231.47.141:8000/daily_price';
var DAILY_STATS_URL =  'http://35.231.47.141:8000/daily_stats';

function parseData(parse) {
	return function(d) {
		var e = {};
		e.date = parse(d[0]);
		e.dateI = d[0]
		e.open = d[1].open;
		e.high = d[1].high;
		e.low = d[1].low;
		e.close = d[1].close;
		e.volume = d[1].volume;

		return e;
	};
}

function parseStat(statsMap) {
	return function(d) {
		var day = d.dateI;
		if (statsMap[day] != undefined) {
			d['macd'] = {'signal':statsMap[day]['macd_signal'], 'macd': statsMap[day]['macd_value'], 'divergence':statsMap[day]['macd_histogram']}
			for (let k of objToStrMap(statsMap[day]).keys()) {
				if (k == 'date' || k.includes('macd')) {
					continue;
				}
				d[k] = statsMap[day][k];
			}
		}
	};
}

function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

const parseDate = timeParse("%Y%m%d");

export function getData(ticker, startDate, endDate) {
  var price_options = {
			method: 'GET',
      url: DAILY_PRICE_URL,
      headers: {
          'User-Agent': 'Request-Promise'
		  },
      qs : {
        ticker: ticker,
				start_date: startDate,
				end_date: endDate
      },
      json: true // Automatically parses the JSON string in the response
  };

	var stats_options = {
			method: 'GET',
			url: DAILY_STATS_URL,
			headers: {
					'User-Agent': 'Request-Promise'
			},
			qs : {
				ticker: ticker,
				start_date: startDate,
				end_date: endDate
			},
			json: true // Automatically parses the JSON string in the response
	};

	var promise1 = rp(price_options);
	var promise2 = rp(stats_options)

	return Promise.all([promise1, promise2])
		  .then(function(values){
				var data = Array.from(objToStrMap(values[0])).map(x => parseData(parseDate)(x));
				data.map(x => parseStat(values[1])(x))
				return data
			})
      .catch(function (err) {
        console.error(err);
      });


	//return promiseRet;

	// const promiseMSFT = fetch("//rrag.github.io/react-stockcharts/data/MSFT.tsv")
	// 	.then(response => response.text())
	// 	.then(function (data) {
	// 		var ret = tsvParse(data, parseData(parseDate));
	// 		console.log(ret);
	// 		return ret;
	// 	});
	//return promiseMSFT;
}
