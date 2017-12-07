var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var BookModel = require('../models/book');
var xlsx = require('node-xlsx');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /signin 登录页
router.get('/all', checkLogin, function (req, res, next) {
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
router.get('/create2', function (req, res, next) {
    var obj = xlsx.parse('./book21.xlsx');
    obj[0].data.forEach(function (element) {
        var book = {};
        if (element[0] != undefined) {
            book.bookId = element[0];
        }
        if (element[1] != undefined) {
            book.bookname = element[1];
        }
        if (element[3] != undefined) {
            book.branch = element[3];
        }
        if (element[4] != undefined) {
            book.editor = element[4];
        }
        if (element[5] != undefined) {
            book.author = element[5];
        }
        BookModel.create(book)
            .then(function (b) {
                var d = 0;
            })
            .catch(next);
    }, this);
    return res.json({ code: 0, message: 'Create successfully' });
});
router.get('/create3', function (req, res, next) {
    var obj = xlsx.parse('./book22.xlsx');
    obj[0].data.forEach(function (element) {
        var book = {};
        if (element[0] != undefined) {
            book.bookId = element[0];
        }
        if (element[1] != undefined) {
            book.bookname = element[1];
        }
        if (element[3] != undefined) {
            book.branch = element[3];
        }
        if (element[4] != undefined) {
            book.editor = element[4];
        }
        if (element[5] != undefined) {
            book.author = element[5];
        }
        BookModel.create(book)
            .then(function (b) {
                var d = 0;
            })
            .catch(next);
    }, this);
    return res.json({ code: 0, message: 'Create successfully' });
});
// POST /create 创建图书
router.post('/create', checkLogin, function (req, res, next) {
    var bookId = req.body.bookId;
    var bookname = req.body.bookname;
    var branch = req.body.branch;
    var editor = req.body.editor;
    var author = req.body.author;
    var userId = req.body.userId;
    var book = {
        bookId: bookId,
        bookname: bookname,
        branch: branch,
        editor: editor,
        author: author
    };
    BookModel.create(book)
        .then(function (b) {
            return res.json({ code: 0, message: 'Create successfully', bookid: bookId });
        })
        .catch(next);
});
// POST /update 创建图书
router.post('/update', checkLogin, function (req, res, next) {
    var bookId = req.body.bookId;
    var bookname = req.body.bookname;
    var branch = req.body.branch;
    var editor = req.body.editor;
    var author = req.body.author;
    var userId = req.body.userId;
    BookModel.getBookById(bookId)
        .then(function (b) {
            if (bookname != undefined) {
                b.bookname = bookname;
            }
            if (branch != undefined) {
                b.branch = branch;
            }
            if (editor != undefined) {
                b.editor = editor;
            }
            if (author != undefined) {
                b.author = author;
            }
            BookModel.updateBookById(bookId, b)
                .then(function (b) {
                    return res.json({ code: 0, message: 'Update successfully', bookid: bookId });
                })
                .catch(next);
        })
        .catch(next);
});

router.get('/remove', checkLogin, function (req, res, next) {
    var bookId = req.query.bookId;
    BookModel.delBookById(bookId)
        .then(function () {
            return res.json({ code: 0, message: 'Del successfully', bookid: bookId });
        })
        .catch(next);
});

router.get('/search', function (req, res, next) {
    var search = req.query.search;
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var count = req.query.count ? parseInt(req.query.count) : 10;
    BookModel.searchEbooksCount(search)
        .then(function (n) {
            BookModel.searchEbooks(search, page, count)
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
module.exports = router;