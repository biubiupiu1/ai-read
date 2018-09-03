const SplitClient = require('../sdk/baidu/index').SplitClient;

module.exports = function (req, res) {
    if (!req.query.text)
        return res.status(500).send();
    console.log(req.query.text);
    SplitClient.lexer(req.query.text).then(function(result) {
        console.log(result);
        res.send(result);
    }).catch(function(err) {
        // 如果发生网络错误
        return res.status(500).send();
    });
};