const https = require('https');
const querystring = require('querystring');
const txAiSign = require("tencent-ai-sign");
const app_id = '1107126129';
const app_key = 'ZQ25owFNX2OHso2U';

//生成参数
function mkparams() {
    return {
        "app_id": app_id,
        "time_stamp": Date.parse(new Date()) / 1000,
        "nonce_str": (Math.random() + '').substring(0, 31),
    };
}

//
function getParams(base64) {
    if (!app_key || !app_id) {
        return "app_key或app_id不能为空";
    }
    let params = mkparams();
    // params.image=getBase64(path);
    params.image = base64;
    params.sign = txAiSign(params, app_key);
    return params;
}


/***
 OCR,获取照片内容
 base64:不包含image头部的base64内容
 测试：
 与MAC命令下的base64执行后的结果一致即可
 eg: base64 1.jpg
 ***/
function getOCRContent(base64) {

    return new Promise((resolve, reject) => {

        let params = getParams(base64);
        //获取图像识别内容
        let reqocrparams = {
            url: "https://api.ai.qq.com",
            path: '/fcgi-bin/ocr/ocr_generalocr',
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            params: params,
            timeout: 6000
        };

        getHttps({...reqocrparams}).then((res) => {
            let {data, status} = res;
            if (status === 200) {
                if (typeof data !== 'object') {
                    try {
                        data = JSON.parse(data);
                    } catch (err) {
                        data = null;
                    }
                }
            } else {
                reject('错误' + status);
            }
            if (!data)
                reject('获取错误');
            resolve(data);
        }).catch((err) => {
            reject(err);
        });

    });
}

function getHttps({url, path, method, headers, params, timeout}) {
    let reqData = [];
    let size = 0;
    let host = url.replace(/^http[s]?:\/\//, '');//去掉协议头
    let opt = {hostname: host, method: method ? method : 'GET', path: path ? path : '/'};//https没有超时请求
    if (headers) {
        opt.headers = headers;
    }
    return new Promise((resolve, reject) => {
        let req = https.request(opt, (res) => {
            // res.setEncoding('utf8');
            res.on('data', (data) => {
                reqData.push(data);
                size += data.length;
            });
            res.on('end', () => {
                clearTimeout(timer);//清楚
                reqData = Buffer.concat(reqData, size);
                reqData = reqData.toString();
                resolve({data: reqData, status: res.statusCode});
            })
        });
        req.on('error', (e) => {
            clearTimeout(timer);
            reject(e);
        });
        let timer = setTimeout(() => {
            clearTimeout(timer);
            req.abort();
            reject("请求超时！");
        }, timeout);
        if (params) req.write(querystring.stringify(params));
        req.end();
    })
}

export default getOCRContent;
