const images = require("images");
const fs = require('fs');
const formidable = require('formidable'),
    AVATAR_UPLOAD_FOLDER = '/imgs/';

module.exports = {
    toBase64(req) {
        return new Promise((resolve, reject) => {
            try {
                let form = new formidable.IncomingForm();   //创建上传表单
                form.encoding = 'utf-8';        //设置编辑
                form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER;     //设置上传目录
                form.keepExtensions = true;     //保留后缀
                form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
                form.parse(req, function (err, params, files) {
                    if (err) {
                        reject(err);
                    }
                    let size = params.size || 800;
                    let image = images(files.img.path);
                    let width = images(files.img.path).width();
                    size = Number(size);
                    size = width > size ? size : width;
                    let quality = params.quality || 70;
                    image.resize(size).save(files.img.path, 'jpg', {
                        quality
                    });
                    let _width = image.width();
                    let _height = image.height();
                    let imageBuf = fs.readFileSync(files.img.path);
                    fs.unlink(files.img.path, function (err) {
                        if (err)
                            console.log('删除图片失败呢', err);
                    });
                    let base64 = imageBuf.toString("base64");
                    resolve({image: {base64: base64, width: _width, height: _height}, params, files})
                });
            } catch (e) {
                console.log(e);
                reject('服务器错误');
            }
        })
    }
};