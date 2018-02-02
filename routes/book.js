var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var BookModel = require('../models/book');
var xlsx = require('node-xlsx');
var checkLogin = require('../middlewares/check').checkLogin;
var moment = require('moment');

// GET /signin 登录页
router.get('/all', function (req, res, next) {
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

router.get('/byLastTime', function (req, res, next) {
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var count = req.query.count ? parseInt(req.query.count) : 10;
    var time = moment(new Date(req.query.time)).format("YYYY-MM-DD HH:mm:ss");
    BookModel.getAllBookByLastTimeCount(time)
        .then(function (n) {
            BookModel.getAllBookByLastTime(time, page, count)
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
    var obj = xlsx.parse('./1.xlsx');
    obj[0].data.forEach(function (element) {
        var book = {};
        if (element[0] != undefined) {
            book.bookId = element[0].toString();
        }
        if (element[1] != undefined) {
            book.bookname = element[1].toString();
        }
        if (element[2] != undefined) {
            book.ISBN = element[2].toString();
        }
        if (element[3] != undefined) {
            book.branch = element[3].toString();
        }
        if (element[4] != undefined) {
            book.editor = element[4].toString();
        }
        if (element[5] != undefined) {
            book.author = element[5].toString();
        }
        if (element[6] != undefined) {
            book.authorCompany = element[6].toString();
        }
        if (element[7] != undefined) {
            book.ztfCategory = element[7].toString();
        }
        if (element[8] != undefined) {
            book.swCategory = element[8].toString();
        }
        if (element[9] != undefined) {
            book.wdCategory = element[9].toString();
        }
        if (element[10] != undefined) {
            book.zyCategory = element[10].toString();
        }
        if (element[11] != undefined) {
            book.kcCategory = element[11].toString();
        }
        if (element[12] != undefined) {
            book.publishDate = moment(new Date(element[12])).format("YYYY-MM-DD HH:mm:ss");
        }
        if (element[13] != undefined) {
            book.editRoom = element[13].toString();
        }
        if (element[14] != undefined) {
            book.price = element[14].toString();
        }
        if (element[15] != undefined) {
            book.CIP = element[15].toString();
        }
        if (element[16] != undefined) {
            book.zkCategory = element[16].toString();
        }
        if (element[17] != undefined) {
            book.mo = element[17].toString();
        }
        if (element[18] != undefined) {
            book.pages = element[18].toString();
        }
        if (element[19] != undefined) {
            book.seriesName = element[19].toString();
        }
        if (element[20] != undefined) {
            book.introduce = element[20].toString();
        }
        if (element[21] != undefined) {
            book.binding = element[21].toString();
        }
        if (element[22] != undefined) {
            book.bookType = element[22].toString();
        }
        if (element[23] != undefined) {
            book.bookNumber = element[23].toString();
        }
        if (element[24] != undefined) {
            book.sheet = element[24].toString();
        }
        if (element[25] != undefined) {
            book.wordNumber = element[25].toString();
        }
        book.lastUpdateTime = moment(new Date().now).format("YYYY-MM-DD HH:mm:ss");
        book.createTime = moment(new Date().now).format("YYYY-MM-DD HH:mm:ss");
        BookModel.create(book)
            .then(function (b) {
                var d = 0;
            })
            .catch(next);
    }, this);
    return res.json({ code: 0, message: 'Create successfully' });
});

// POST /create 批量导入图书数据
router.get('/update2', function (req, res, next) {
    var obj = xlsx.parse('./666.xlsx');
    obj[0].data.forEach(function (element) {
        var book = {};
        if (element[0] != undefined) {
            book.bookId = element[0].toString();
        }
        if (element[1] != undefined) {
            book.bookname = element[1].toString();
        }
        if (element[2] != undefined) {
            book.ISBN = element[2].toString();
        }
        if (element[3] != undefined) {
            book.branch = element[3].toString();
        }
        if (element[4] != undefined) {
            book.editor = element[4].toString();
        }
        if (element[5] != undefined) {
            book.author = element[5].toString();
        }
        if (element[6] != undefined) {
            book.authorCompany = element[6].toString();
        }
        if (element[7] != undefined) {
            book.ztfCategory = element[7].toString();
        }
        if (element[8] != undefined) {
            book.swCategory = element[8].toString();
        }
        if (element[9] != undefined) {
            book.wdCategory = element[9].toString();
        }
        if (element[10] != undefined) {
            book.zyCategory = element[10].toString();
        }
        if (element[11] != undefined) {
            book.kcCategory = element[11].toString();
        }
        if (element[12] != undefined) {
            book.publishDate = moment(new Date(element[12])).format("YYYY-MM-DD HH:mm:ss");
        }
        if (element[13] != undefined) {
            book.editRoom = element[13].toString();
        }
        if (element[14] != undefined) {
            book.price = element[14].toString();
        }
        if (element[15] != undefined) {
            book.CIP = element[15].toString();
        }
        if (element[16] != undefined) {
            book.zkCategory = element[16].toString();
        }
        if (element[17] != undefined) {
            book.mo = element[17].toString();
        }
        if (element[18] != undefined) {
            book.pages = element[18].toString();
        }
        if (element[19] != undefined) {
            book.seriesName = element[19].toString();
        }
        if (element[20] != undefined) {
            book.introduce = element[20].toString();
        }
        if (element[21] != undefined) {
            book.binding = element[21].toString();
        }
        if (element[22] != undefined) {
            book.bookType = element[22].toString();
        }
        if (element[23] != undefined) {
            book.bookNumber = element[23].toString();
        }
        if (element[24] != undefined) {
            book.sheet = element[24].toString();
        }
        if (element[25] != undefined) {
            book.wordNumber = element[25].toString();
        }
        book.lastUpdateTime = moment(new Date().now).format("YYYY-MM-DD HH:mm:ss");
        book.createTime = moment(new Date().now).format("YYYY-MM-DD HH:mm:ss");
        BookModel.getBookById(book.bookId)
            .then(function (b) {
                if (b != undefined) { book.createTime = b.createTime; }
                BookModel.delBookById(book.bookId)
                    .then(function () {
                        BookModel.create(book)
                            .then(function (r) {
                                var d = 0;
                            })
                            .catch(next);
                    })
                    .catch(next);
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
    book.lastUpdateTime = Date.now();
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
            b.lastUpdateTime = Date.now();
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