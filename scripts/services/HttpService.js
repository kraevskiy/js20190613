export const HttpService = {
  sendRequest(url) {
    return fetch(url).then(res => res.json());

    // return new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();

    //   xhr.open('GET', url);

    //   xhr.send();

    //   xhr.onload = () => {
    //     if (xhr.status != 200) {
    //       reject(new Error(xhr.statusText));
    //       return;
    //     } else {
    //       let responseData = JSON.parse(xhr.responseText);
    //       resolve(responseData);
    //     }
    //   }

    //   xhr.onerror = () => {
    //     reject(xhr.statusText);
    //   }
    // })
  },

  sendMultipleRequests(urls) {
    let requests = urls.map(url => HttpService.sendRequest(url));
    return Promise.all(requests);
  }
};