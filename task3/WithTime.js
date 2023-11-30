const EventEmitter = require("./EventEmitter.js");
const https = require("https");

class WithTime extends EventEmitter {
    async execute(asyncFunc, ...args) {
        try {
            this.emit("begin");
            console.time("execute");

            const result = await asyncFunc(...args);

            console.timeEnd("execute");
            this.emit("end");

            this.emit("data", result);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    fetchData(url) {
        return new Promise((resolve, reject) => {
            https
                .get(url, (response) => {
                    let data = "";

                    response.on("data", (chunk) => {
                        data += chunk;
                    });

                    response.on("end", () => {
                        try {
                            resolve(JSON.parse(data));
                        } catch (parseError) {
                            reject(parseError);
                        }
                    });
                })
                .on("error", (error) => {
                    reject(error);
                });
        });
    }
}

module.exports = WithTime;
