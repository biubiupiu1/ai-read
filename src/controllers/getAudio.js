import {SpeechClient} from "../sdk/baidu/index";
const stream = require('stream');

module.exports = function (req, res) {
    /**
     * /api/getaudio 语言合成
     * @param {string} spd number.
     * @param {string} per number 人声.
     */
    if (!req.query.text)
        return res.status(500).send();

    let spd = req.query.spd || 5;
    let per = req.query.per || 0;
    let text = decodeURI(req.query.text);
    SpeechClient.text2audio(text, {spd, per}).then(function (result) {
        if (result.data) {
            // fs.writeFileSync('public/music/tts.mpVoice.mp3', result.data);
            let bufferStream = new stream.PassThrough();
            bufferStream.end(result.data);
            res.header('Content-Type', 'audio/mp3');
            res.header('Content-Disposition', 'attachment; filename=test.mp3');
            res.header('Content-Length', result.data.length);

            bufferStream.pipe(res)
        } else {
            // 服务发生错误
            return res.status(500);
        }
    }, function (e) {
        // 发生网络错误
        return res.status(500);
    });
};