import {TranslateClient} from "../sdk/baidu/index";

module.exports = function (req, res) {

    if (!req.query.query)
        return res.status(500).send();

    let query = req.query.query;
    let to = req.query.to || 'zh';

    TranslateClient.translate({query, to}).then(result => {
        res.send(result.trans_result);
    }).catch(err => {
        return res.status(500).send();
    })

};