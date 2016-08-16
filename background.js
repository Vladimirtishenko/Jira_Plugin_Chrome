if (!chrome.runtime) {
    // Chrome 20-21
    chrome.runtime = chrome.extension;
} else if (!chrome.runtime.onMessage) {
    // Chrome 22-25
    chrome.runtime.onMessage = chrome.extension.onMessage;
    chrome.runtime.sendMessage = chrome.extension.sendMessage;
    chrome.runtime.onConnect = chrome.extension.onConnect;
    chrome.runtime.connect = chrome.extension.connect;
}

let Ajax = (function() {
    let Request = function(data) {
        data.method = data.method || 'get';
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (data.success) data.success(xhr.responseText);
                } else {
                    if (data.error) data.error(xhr.statusText);
                }
            }
        };
        xhr.open(data.method, data.url, true);
        if (data.beforeSend) {
            data.beforeSend(xhr);
        }
        let dataString = [];
        if (data.data) {
            for (let k in data.data)
                dataString.push(k + '=' + encodeURIComponent(data.data[k]));
        }
        if (data.method.toLowerCase() == 'post') {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        }
        xhr.send(dataString.join('&'));
    };

    return {
        send: function(data) {
            new Request(data);
        }
    }

})();

let Background = (function() {

    function Background() {
        this.initMessageListeners();
    }

    /**
     * works with external messages and performs appropriate commands
     */
    Background.prototype.initMessageListeners = function() {
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                switch (request.type) {
                    case 'makeRequest':
                        return this.makeRequest(request.url, request.method, request.objectOfData, sendResponse);
                        break;
                    default:
                        break;
                }
            }
        );
    }

    /**
     * make api request
     * @url - request url
     * @sendResponse - callback object of chrome.runtime.onMessage.addListener
     */

    Background.prototype.makeRequest = function(url, method, objectOfData, sendResponse) {
        Ajax.send({
            method: method,
            url: url,
            data: objectOfData,
            success: function(data) {
                sendResponse(data);
            },
            error: function(data) {
                sendResponse(data);
            }
        });
        return true;
    }

    return new Background();

})();


