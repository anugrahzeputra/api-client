const {ApiClient} = require("./api-client");

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

module.exports = {AnuDbClient}