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

class AnuDbClient {

    constructor(url, key) {
        this._apiClient = new ApiClient().createClient(url || "");
        this._apiClient.addHeaders({
            "Content-Type": "application/json",
            "X-Api-Key": key || ""
        });
        return this;
    }

    addHeaders(headers) {
        this._apiClient.addHeaders(headers);
        return this;
    }

    from(table) {
        this._table = table;
        return this;
    }

    select(...columns) {
        if(this._apiClient.getMethod() && this._apiClient.getMethod() !== "GET") {
            return;
        }
        this._method = this._apiClient.GET(`/${this._table}`);
        let stringBuilder = ""
        columns.forEach((column) => {
            stringBuilder += column + ",";
        });
        this._method.addParam("select", stringBuilder.slice(0, -1));
        return this;
    }

    insert(data) {
        if(this._apiClient.getMethod() && this._apiClient.getMethod() !== "POST") {
            return;
        }
        console.log("inserted");
        this._method = this._apiClient.POST(`/${this._table}`);
        this._method.addBody(data);
        return this;
    }

    where(data = {}) {
        Object.keys(data).forEach((key) => {
            this._method.addParam(key, `eq.${data[key]}`)
        });
        return this;
    }

    go() {
        console.log(this._apiClient.getUrl())
        if(this._apiClient.getMethod() === "GET") {
            return this._method.fetch();
        } else {
            return this._method.send();
        }
    }
}

const db = new AnuDbClient("http://localhost:8080/rest/v1/crud", "xxxxxxxxx");

db.from("url_list")
    .select("*")
    // .insert({
    //     "url": "https://www.google.com",
    //     "type": "redirect"
    // })
    .go()
    .then(res => res.json())
    .then((res) => res.content)
    .then(console.log);


// const api = new ApiClient()
//     .createClient('http://localhost:8080/rest/v1/crud')
//     .addHeaders({
//         'Content-Type': 'application/json',
//         'X-Api-Key': 'xxxxxxxxx'
//     });
//
// api.GET("/url_list")
//     .addParam("select", "*")
//     .addParam("type", "eq.redirect")
//     .fetch()
//     .then(res => res.json()).then((res) => res.content).then(console.log);