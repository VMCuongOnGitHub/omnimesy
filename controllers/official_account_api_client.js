const utils = require('./utils');
const constants = require('../helper/constants');
const fs = require('fs');
const os = require('os');
const { sep } = require('path');
const request = require("request");
let logger = require("log4js").getLogger("chat_channel_zalo");

class OfficialAccountAPIClient {
    constructor(token) {
        this.requestData = {token};
    }

    getUserProfile(id, cb) {
        let data = `{"user_id":"${id}"}`;
        const options = utils.Utils.getRequestOptions();
        options.url += 'getprofile';
        options.qs.data = data;
        options.method = 'GET';
        return utils.Utils.sendMessage(options, this.requestData, cb);
    }

    uploadFileFromUrl(url, fileName) {
        const options = utils.Utils.getRequestOptions();
        const tmpDir = os.tmpdir();
        options.url += 'upload/file';
        options.method = 'POST';
        let requestData = this.requestData;
        return new Promise((resolve, reject) => {
            if (!fileName) {
                reject("File name is empty")
            }
            fs.mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
                if (err) reject(err);
                let tmpPath = `${directory}/${fileName}`;
                request.get({url: url}, (error, response, body) => {
                    if (error) {
                        reject(error)
                    }
                })
                    .pipe(fs.createWriteStream(tmpPath))
                    .on('finish', function () {
                        options.formData = {
                            file: fs.createReadStream(tmpPath)
                        };
                        utils.Utils.sendMessage(options, requestData, (error, res, body) => {
                            if (error) {
                                reject(error)
                            } else {
                                if (res.statusCode >= 400) {
                                    reject(body)
                                } else if(body) {
                                    if (typeof body !== "object" && !Array.isArray(body)) {
                                        const bodyObject = JSON.parse(body);
                                        if (bodyObject.error) {
                                            reject(bodyObject)
                                        } else {
                                            fs.unlink(tmpPath, (err)=>{
                                                if (err) reject(err);
                                            });
                                            resolve(bodyObject)
                                        }
                                    } else {
                                        if (body.error) {
                                            reject(body)
                                        }
                                        else {
                                            fs.unlink(tmpPath, (err)=>{
                                                if (err) reject(err)
                                            });
                                            resolve(body)
                                        }
                                    }
                                }
                                else {
                                    reject()
                                }
                            }
                        });
                    })
            });
        })
    }

    uploadFileGifFromUrl(url, fileName) {
        const options = utils.Utils.getRequestOptions();
        const tmpDir = os.tmpdir();
        options.url += 'upload/gif';
        options.method = 'POST';
        let requestData = this.requestData;
        return new Promise((resolve, reject) => {
            if (!fileName) {
                reject("File name is empty")
            }
            fs.mkdtemp(`${tmpDir}${sep}`, (err, directory) => {
                if (err) reject(err);
                let tmpPath = `${directory}/${fileName}`;
                request.get({url: url}, (error, response, body) => {
                    if (error) {
                        reject(error)
                    }
                })
                    .pipe(fs.createWriteStream(tmpPath))
                    .on('finish', function () {
                        options.formData = {
                            file: fs.createReadStream(tmpPath)
                        };
                        utils.Utils.sendMessage(options, requestData, (error, res, body) => {
                            if (error) {
                                reject(error)
                            } else {
                                if (res.statusCode >= 400) {
                                    reject(body)
                                } else if(body) {
                                    if (typeof body !== "object" && !Array.isArray(body)) {
                                        const bodyObject = JSON.parse(body);
                                        if (bodyObject.error) {
                                            reject(bodyObject)
                                        } else {
                                            fs.unlink(tmpPath, (err)=>{
                                                if (err) reject(err);
                                            });
                                            resolve(bodyObject)
                                        }
                                    } else {
                                        if (body.error) {
                                            reject(body)
                                        }
                                        else {
                                            fs.unlink(tmpPath, (err)=>{
                                                if (err) reject(err)
                                            });
                                            resolve(body)
                                        }
                                    }
                                }
                                else {
                                    reject()
                                }
                            }
                        });
                    })
            });
        })
    }

    sendFileMessage(id, fileData, cb) {
        let attachment = {
            type: constants.TEMPLATE_TYPE.FILE,
            payload: fileData
        };
        return this.sendDisplayMessage(id, {attachment: attachment}, cb)
    }

    sendTextMessage(id, text, cb) {
        return this.sendDisplayMessage(id, {text}, cb);
    }

    sendListTemplateMessage(id, elements, buttons, cb) {
        const attachment = {
            type: constants.ATTACHMENT_TYPE.TEMPLATE,
            payload: {template_type: constants.TEMPLATE_TYPE.LIST, elements: elements, buttons: buttons}
        };
        return this.sendDisplayMessage(id, {attachment: attachment}, cb);
    }

    sendMediaTemplateMessage(id, text, elements, buttons, cb) {
        const attachment = {
            type: constants.ATTACHMENT_TYPE.TEMPLATE,
            payload: {template_type: constants.TEMPLATE_TYPE.MEDIA, elements: elements, buttons: buttons}
        };
        return this.sendDisplayMessage(id, {text: text, attachment: attachment}, cb);
    }

    sendTemplateMessage(id, text, elements, buttons, cb) {
        const attachment = {type: constants.ATTACHMENT_TYPE.TEMPLATE, payload: {elements: elements, buttons: buttons}};
        return this.sendDisplayMessage(id, {text: text, attachment: attachment}, cb);
    }

    sendDisplayMessage(id, payload, cb) {
        const options = this.generateOARequestPayload(id);
        options.json = Object.assign(Object.assign({}, options.json), {message: payload});
        return utils.Utils.sendMessage(options, this.requestData, cb);
    }

    generateOARequestPayload(id) {
        const options = utils.Utils.getRequestOptions();
        options.url += 'message';
        options.method = 'POST';
        options.json = {
            recipient: {
                "user_id": id
            },
        };
        return options;
    }
}

exports.OfficialAccountAPIClient = OfficialAccountAPIClient;
