const express = require('express');
const router = express.Router();
const controllers = require('../controllers');

/**
 * /api/getocr 图片解析
 * @param {string} type 识别引擎.
 * @param {number} quality 图片质量.
 * @param {number} size 图片大小.
 */
router.post('/api/getocr', controllers.getOcr);

/**
 * /api/getaudio 语音合成
 * @param {number} spd 语速.
 * @param {number} per 人声.
 */
router.get('/api/getaudio', controllers.getAudio);

/**
 * /api/getaudio 翻译
 * @param {string} query 文本.
 */
router.get('/api/translate', controllers.translate);

/**
 * /api/getaudio 分词
 * @param {string} text 文本.
 */
router.get('/api/splitwords', controllers.splitWords);

module.exports = router;