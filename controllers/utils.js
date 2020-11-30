const request = require('request');
class Utils {
    constructor() {
    }
    static getRequestOptions() {
        let requestOptions = Utils.requestOptions;
        requestOptions.url = 'https://openapi.zalo.me/v2.0/oa/';
        return JSON.parse(JSON.stringify(requestOptions));
    }
    static sendMessage(options, requestData, cb) {
        options.qs.access_token = requestData.token;
        if (requestData.hasOwnProperty('proxy')) {
            options.proxy = requestData.proxy;
        }
        if (typeof cb != 'function') {
            return new Promise((resolve, reject) => {
                request(options, (error, response, body) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        if (response.statusCode>=400) {
                            reject(body)
                        }
                        else if(body){
                            if (typeof body !== "object" && !Array.isArray(body)) {
                                const bodyObject = JSON.parse(body);
                                if(bodyObject.error) {
                                    reject(bodyObject)
                                }
                                else {
                                    resolve(bodyObject)
                                }
                            }
                            else {
                                if (body.error) {
                                    reject(body)
                                }
                                else {
                                    resolve(body)
                                }
                            }
                        }
                        else {
                            reject()
                        }
                    }
                });
            });
        }
        else {
            request(options, (error, response, body) => {
                return cb(error, response, body);
            });
            return Promise.resolve();
        }
    }
}
exports.Utils = Utils;
Utils.requestOptions = {
    url: '',
    qs: {
        access_token: undefined
    },
    method: undefined
};
