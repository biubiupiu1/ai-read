let AipOcrClient = require("./src/index").ocr;
let AipSpeechClient = require("./src/index").speech;
let AipTranslateClient = require("./src/index").translate;
let HttpClient = require("./src/index").HttpClient;
let AipNlpClient = require("./src/index").nlp;

// 设置APPID/AK/SK
const ocr = {
    APP_ID: "11586964",
    API_KEY: "SvUsAi8825aLQesquh0Wb00Z",
    SECRET_KEY: "4EEaO33us1wlqYo9N4BwiYG0ea15Gj0k",
};

const translate = {
    APP_ID: "20180825000198706",
    SECRET_KEY: "JJkBmjBLF73dPZ87Ffk6",
};

// 新建一个对象，建议只保存一个对象调用服务接口
let OcrClient = new AipOcrClient(ocr.APP_ID, ocr.API_KEY, ocr.SECRET_KEY);
let SpeechClient = new AipSpeechClient(ocr.APP_ID, ocr.API_KEY, ocr.SECRET_KEY);
let TranslateClient = new AipTranslateClient(translate.APP_ID, translate.SECRET_KEY);
let SplitClient = new AipNlpClient(ocr.APP_ID, ocr.API_KEY, ocr.SECRET_KEY);

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({timeout: 5000});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function(requestOptions) {
    // 查看参数
    requestOptions.timeout = 8000;
    // 返回参数
    return requestOptions;
});


export {OcrClient, SpeechClient, TranslateClient, SplitClient};