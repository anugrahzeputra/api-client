class ApiClient {

    constructor() {}

    createClient(url) {
        this._url = url || "";
        return this;
    }

    GET(path) {
        this._method = "GET";
        return new GET(this, path);
    }

    POST(path) {
        this._method = "POST";
        return new POST(this, path);
    }

    PUT(path) {
        this._method = "PUT";
        return new PUT(this, path);
    }

    DELETE(path) {
        this._method = "DELETE";
        return new DELETE(this, path);
    }

    addHeaders(headers) {
        this._headers = headers;
        return this;
    }

    getMethod() {
        return this._method;
    }

    getUrl() {
        return this._url;
    }
}

class GET extends ApiClient {
    constructor(ApiClient, path = "") {
        super();
        super.createClient(ApiClient._url + path);
        this._headers = ApiClient._headers;
    }

    fetch() {
        return fetch(this._url, {
            method: 'GET',
            headers: this._headers || {}
        })
    }

    addParam(param, value) {
        this._url += this._lastParam ? `&${param}=${value}` : `?${param}=${value}`;
        this._lastParam = param;
        return this;
    }
}

class POST extends ApiClient {
    constructor(ApiClient, path = "") {
        super();
        super.createClient(ApiClient._url + path);
        this._headers = ApiClient._headers;
    }

    send() {
        console.log(this._url, this._body, this._headers)
        return fetch(this._url, {
            method: 'POST',
            headers: this._headers || {},
            body: JSON.stringify(this._body || {})
        })
    }

    addBody(body) {
        this._body = body;
        return this;
    }

    addParam(param, value) {
        this._url += this._lastParam ? `&${param}=${value}` : `?${param}=${value}`;
        this._lastParam = param;
        return this;
    }

}

class PUT extends ApiClient {
    constructor(ApiClient, path = "") {
        super();
        super.createClient(ApiClient._url + path);
        this._headers = ApiClient._headers;
    }

    send() {
        return fetch(this._url, {
            method: 'PUT',
            headers: this._headers || {},
            body: JSON.stringify(this._body || {})
        })
    }

    addBody(body) {
        this._body = body;
        return this;
    }

    addParam(param, value) {
        this._url += this._lastParam ? `&${param}=${value}` : `?${param}=${value}`;
        this._lastParam = param;
        return this;
    }
}

class DELETE extends ApiClient {
    constructor(ApiClient, path = "") {
        super();
        super.createClient(ApiClient._url + path);
        this._headers = ApiClient._headers;
    }

    send() {
        return fetch(this._url, {
            method: 'DELETE',
            headers: this._headers || {}
        })
    }

    addParam(param, value) {
        this._url += this._lastParam ? `&${param}=${value}` : `?${param}=${value}`;
        this._lastParam = param;
        return this;
    }
}

module.exports = {ApiClient}