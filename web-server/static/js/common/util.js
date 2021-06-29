let restText = document.getElementById("restmsg");

async function restSuccess(msg) {
    restText.style.color = 'green';
    restText.textContent = msg;
    setTimeout(() => {
        restText.textContent = '';
    }, 5000);
}

async function restError(msg) {
    restText.style.color = 'red';
    restText.textContent = msg;
    setTimeout(() => {
        restText.textContent = '';
    }, 5000);
}

function retrieveErrorMsg(name) {
    return 'Failed to retrieve ' + name + '. Check the server logs for more information.'
}

function visibilityChange(value) {
    return value ? 'inherit' : 'hidden';
}

function combineCallbacks(dataCallback, extraCallback) {
    return (extraCallback == null ? dataCallback :
        responseText => {
            dataCallback(responseText);
            extraCallback(responseText);
        });
}

async function getRequest(url, callback, restmsg) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                callback(this.responseText);
            } else {
                restError(restmsg);
            }
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

async function postRequest(url, data, successMsg, errorMsg) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                restSuccess(successMsg);
            } else {
                restError(errorMsg);
            }
        }
    }
    xhr.open("POST", url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));
}

function tryParseJSON(json, url) {
    let data;
    try {
        data = JSON.parse(json);
    } catch (_) {
        restError('Recieved invalid json data from ' + url);
    }
    return data;
}