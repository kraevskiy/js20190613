const COINS_URL = 'https://api.coinpaprika.com/v1/coins';
const getSingleCoinUrl = id => `${COINS_URL}/${id}/ohlcv/latest`;


const HttpService = {
  sendRequest(url, successCallback, method = 'GET') {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);

    xhr.send();

    xhr.onload = () => {
      if (xhr.status != 200) {
        alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
      } else {
        let responseData = JSON.parse(xhr.responseText);
        successCallback(responseData);
      }
    }
  },

  sendMultipleRequests(urls, callback) {
    let requestCount = urls.length;
    let results = [];

    urls.forEach(url => {
      HttpService.sendRequest(url, data => {
        results.push({ url, data });
        requestCount--;

        if (!requestCount) {
          callback(results);
        }
      })
    })
  }
};

export const DataService = {
  getCurrencies(callback) {
    HttpService.sendRequest(COINS_URL, data => {
      data = data.slice(0, 10);
      DataService.getCurrenciesPrices(data, callback);
    });
  },
 
  getCurrenciesPrices(data, callback) {
    let coinsIds = data.map(coin => coin.id);

    const coinsIdMap = coinsIds.reduce((acc, id) => {
      acc[getSingleCoinUrl(id)] = id;
      return acc;
    }, {});

    HttpService.sendMultipleRequests(Object.keys(coinsIdMap), coins => {
      const dataWithPrices = data.map(coinData => {
        let coinPriceUrl = getSingleCoinUrl(coinData.id);
        let [coindPriceData] = coins.find(coin => coin.url === coinPriceUrl).data;

        coinData.price = coindPriceData.close;
        return coinData;
      });

      callback(dataWithPrices);
    })


    // console.log(coinsIdMap)
  }

}