'use strict';

const MD5 = require('./lib/md5');
const request = require('request');

const URL = 'http://api.fanyi.baidu.com/api/trans/vip/translate';

class Translate {
    constructor(appId, sk) {
        this.appId = appId;
        this.sk = sk;
    }

    translate(param) {
        console.log(this.appId);
        let salt = (new Date).getTime();
        let q = param.query;
        let from = param.from || 'auto';
        let to = param.to || 'zh';
        let appid = this.appId;
        let str1 = appid + q + salt + this.sk;
        let sign = MD5(str1);

        let requestInfo = {
            form: {
                q,
                appid,
                salt,
                to,
                sign,
                from
            },
            method: 'POST',
            url: URL,
        };

        return this.req(requestInfo);

    }

    req(options) {
        return new Promise(function (resolve, reject) {
            request(options, function (error, response, body) {
                if (error === null) {
                    try {
                        resolve(JSON.parse(body));
                    } catch (e) {
                        // 无法解析json请求，就返回原始body
                        resolve(body);
                    }
                } else {
                    reject(error);
                }
            });
        });
    }
}


module.exports = Translate;