var express = require('express');
var router = express.Router();
var BookModel = require('../models/book');
var LicenseModel = require('../models/license');
var BatchModel = require('../models/batch');

// GET /ByUser 获取我所有的批次
router.get('/ByUser', function (req, res, next) {
    var userKey = req.query.userKey;
    BatchModel.getAllBatchByUserKey(userKey)
        .then(function (result) {
            return res.json({ code: 0, batchs: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

// GET /ByBook 获取一本书所有的批次
router.get('/ByBook', function (req, res, next) {
    var bookId = req.query.bookId;
    BatchModel.getAllBatchBybookId(bookId)
        .then(function (result) {
            return res.json({ code: 0, batchs: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});
module.exports = router;