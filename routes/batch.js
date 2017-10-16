var express = require('express');
var router = express.Router();
var BookModel = require('../models/book');
var LicenseModel = require('../models/license');
var BatchModel = require('../models/batch');

// GET /byuser 获取我所有的批次
router.get('/byuser',checkLogin, function (req, res, next) {
    var userkey = req.query.userkey;
    BatchModel.getAllBatchByUserKey(userkey)
        .then(function (result) {
            return res.json({ code: 0, message: 'Successfully',batchs: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

// GET /bybook 获取一本书所有的批次
router.get('/bybook',checkLogin, function (req, res, next) {
    var bookId = req.query.bookId;
    BatchModel.getAllBatchBybookId(bookId)
        .then(function (result) {
            return res.json({ code: 0, message: 'Successfully',batchs: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});
module.exports = router;