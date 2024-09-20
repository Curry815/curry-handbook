// 将原生的ajax封装成promise
function ajax(url, method, data) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);

    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            resolve(xhr.responseText);
        } else {
            reject(xhr.statusText);
        }
    };

    xhr.onerror = function () {
        reject(xhr.statusText);
    };

    if (data) {
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(data));
    } else {
        xhr.send();
    }
  });
}

ajax('https://jsonplaceholder.typicode.com/posts/1', "GET")
    .then(function (response) {
        console.log("Success:", response);
    })
    .catch(function (error) {
        console.log("Error:", error);
    });