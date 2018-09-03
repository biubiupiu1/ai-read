import getOCRContent from "../sdk/tencent/getOCRContent";
import {OcrClient} from "../sdk/baidu/index";
const toBase64 = require('../lib/utils').toBase64;

module.exports = function (req, res) {

    toBase64(req).then(function ({image, params, files}) {
        if (!params.type)
            return res.status(500).send();

        let image_info = {width: image.width, height: image.height};
        switch (params.type) {
            case 'baidu':
                let options = {};
                options["detect_direction"] = "true";
                OcrClient.general(image.base64, options).then(function (result) {
                    let obj = Object.assign({direction: result.direction, words_result: result.words_result}, image_info);
                    res.send({result: obj, type: 'baidu'});
                }).catch(function (err) {
                    res.status(500).send({err});
                });
                break;
            case 'tencent':
                getOCRContent(image.base64).then((data) => {
                    console.log(data);
                    if (data.ret !== 0)
                        return res.status(500).send();
                    let obj = Object.assign({direction: 0, words_result: []}, image_info);
                    data.data.item_list.forEach((item) => {
                        let {width, height, x: left, y: top} = item.itemcoord[0];
                        obj.words_result.push({location: {width, height, left, top}, words: item.itemstring})
                    });
                    res.send({result: obj, type: 'tencent'});

                }).catch((err) => {
                    res.status(500).send({err});
                });
                break;
        }

    }).catch((err) => {
        console.log(err);
        res.status(500).send();
    });

};