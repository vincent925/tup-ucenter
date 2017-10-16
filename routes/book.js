var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var BookModel = require('../models/book');
var xlsx = require('node-xlsx');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /signin 登录页
router.get('/all', checkLogin,function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var count = req.query.count ? parseInt(req.query.count) : 10;
    BookModel.getAllBookCount()
        .then(function (n) {
            BookModel.getAllBook(page, count)
                .then(function (result) {
                    return res.json({ code: 0, message: 'successfully', page: page, count: count, total: n, books: result });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });

});

// POST /create 批量导入图书数据
router.get('/create', function (req, res, next) {
    var obj = xlsx.parse('./book.xlsx');
    obj[0].data.forEach(function (element) {
        var book = {};
        if (element[2] != undefined) {
            book.bookId = element[2];
        }
        if (element[1] != undefined) {
            book.subjectId = element[1];
        }
        if (element[3] != undefined) {
            book.bookname = element[3];
        }
        if (element[4] != undefined) {
            book.price = element[4];
        }
        if (element[12] != undefined) {
            book.ISBN = element[12];
        }
        BookModel.create(book)
            .then(function (b) {
            })
            .catch(next);
    }, this);
    return res.json({ code: 0, message: 'Create successfully' });
});

module.exports = router;