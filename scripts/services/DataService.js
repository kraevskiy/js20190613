const COINS_URL = 'https://api.coinpaprika.com/v1/coins';
const getSingleCoinUrl = id => `${COINS_URL}/${id}/ohlcv/latest`;


const HttpService = {
  sendRequest(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', url);

      xhr.send();

      xhr.onload = () => {
        if (xhr.status != 200) {
          reject(new Error(xhr.statusText));
          return;
        } else {
          let responseData = JSON.parse(xhr.responseText);
          resolve(responseData);
        }
      }

      xhr.onerror = () => {
        reject(xhr.statusText);
      }
    })
  },

  sendMultipleRequests(urls) {
    let requests = urls.map(url => HttpService.sendRequest(url));
    return Promise.all(requests);

    // let requestCount = urls.length;
    // let results = [];

    // urls.forEach(url => {
    //   HttpService.sendRequest(url, data => {
    //     results.push({ url, data });
    //     requestCount--;

    //     if (!requestCount) {
    //       callback(results);
    //     }
    //   })
    // })
  }
};

export const DataService = {
  _sendRequest(url) {
    let promise = new MyPromise((resolve, reject) => {
      HttpService.sendRequest(url, resolve, reject);
    });

    return promise;
  },

  getCurrencies() {
    // HttpService.sendRequest(COINS_URL, data => {
    //   data = data.slice(0, 10);
    //   DataService.getCurrenciesPrices(data, callback);
    // });

    let promise = HttpService.sendRequest(COINS_URL);

    return promise.then(data => {
      data = data.slice(0, 10);
      return DataService.getCurrenciesPrices(data);
    }).catch(err => {
      console.error(err);
    });
  },
 
  getCurrenciesPrices(data) {
    let coinsUrls = data.map(coin => getSingleCoinUrl(coin.id));

    return HttpService.sendMultipleRequests(coinsUrls).then(coins => {
      const dataWithPrice = data.map((item, index) => {
        item.price = coins[index][0].close;
        return item;
      });
      
      return dataWithPrice;
    })
    // const coinsIdMap = coinsIds.reduce((acc, id) => {
    //   acc[getSingleCoinUrl(id)] = id;
    //   return acc;
    // }, {});

    // HttpService.sendMultipleRequests(Object.keys(coinsIdMap), coins => {
    //   const dataWithPrices = data.map(coinData => {
    //     let coinPriceUrl = getSingleCoinUrl(coinData.id);
    //     let [coindPriceData] = coins.find(coin => coin.url === coinPriceUrl).data;

    //     coinData.price = coindPriceData.close;
    //     return coinData;
    //   });

    //   callback(dataWithPrices);
    // })
  }
}

class MyPromise {
  constructor(behaviorFunction) {
    this._status = 'pending';
    this._result = null;
    this._successCallbacks = [];
    this._errorCallbacks = [];
    behaviorFunction(this._resolve.bind(this), this._reject.bind(this));
  }
  
  then(successCallback, errorCallback = () => {}) {
    if (this._status === 'fulfilled') {
      successCallback(this._result);
    } else if (this._status === 'rejected') {
      errorCallback(this._result);
    } else {
      this._successCallbacks.push(successCallback);
      this._errorCallbacks.push(errorCallback);
    }
  }

  _resolve(data) {
    this._status = 'fulfilled';
    this._result = data;
    this._successCallbacks.forEach(callback => callback(data));
  }

  catch(errorCallback) {
    if (this._status === 'rejected') {
      errorCallback(this._result);
    } else {
      this._errorCallbacks.push(errorCallback);
    }
  }

  _reject(error) {
    this._status = 'rejected';
    this._result = error;
    this._errorCallbacks.forEach(callback => callback(error));
  }
}
