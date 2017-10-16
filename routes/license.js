var express = require('express');
var router = express.Router();
var BookModel = require('../models/book');
var LicenseModel = require('../models/license');
var BatchModel = require('../models/batch');
var UUID = require('uuid');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /bybook 根据图书获取序列号
router.get('/bybook', checkLogin,function (req, res, next) {
    var bookId = req.query.bookId;
    LicenseModel.getAllLicenseBybookId(bookId)
        .then(function (result) {
            return res.json({ code: 0, message: 'Successfully',licenses: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

// GET /bybatch 根据批次获取序列号
router.get('/bybatch',checkLogin, function (req, res, next) {
    var batchId = req.query.batchId;
    LicenseModel.getAllLicenseBybatchId(batchId)
        .then(function (result) {
            return res.json({ code: 0, message: 'Successfully',licenses: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});
// GET /bybatch 根据书和人获取序列号
router.get('/bybookanduser',checkLogin, function (req, res, next) {
    var bookId = req.query.bookId;
    var userId = req.query.userId;
    LicenseModel.getLicenseBybookIdAndActivateUserID(bookId,userId)
        .then(function (result) {
            return res.json({ code: 0, message: 'Successfully',licenses: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});
// POST /create 批量生成序列号
router.post('/create',checkLogin, function (req, res, next) {
    var bookId = req.body.bookId;
    var count = req.body.count;
    var validitySecond = req.body.validitySecond;
    var userkey = req.body.userkey;
    var batch = {
        bookId: bookId,
        count: parseInt(count),
        createUser: userkey
    };
    BatchModel.create(batch)
        .then(function (result) {
            b = result.ops[0];
            //var licenseValue = UUID.v1();
            licenses = new Array();
            for (var i = 0; i < batch.count; i++) {
                var l = {
                    bookId: bookId,
                    batchId: b._id.toString(),
                    code: UUID.v1(),
                    state: 'notActive',
                    CreateDateTime: Date.now(),
                    //ActivateDateTime: null,
                    //ActivateUserID: null,
                    ValiditySecond: parseInt(validitySecond),
                    createUser: userkey
                };
                licenses[i] = l;
            }
            LicenseModel.create(licenses)
                .then(function (result) {
                    return res.json({ code: 0, message: 'Create Successfully', batchId: b._id.toString() });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

// POST /activate 激活序列号
router.post('/activate',checkLogin, function (req, res, next) {
    var license = req.body.license;
    var userkey = req.body.userkey;
    LicenseModel.getLicenseByLicense(license)
        .then(function (result) {
            if(result==null){
                return res.json({ code: 10010, message: 'Invalid license' });
            }
            if(result.state=='activated'){
                return res.json({ code: 10009, message: 'License already activated' });
            }
            result.state = 'activated';
            result.ActivateUserID = userkey;
            result.ActivateDateTime=Date.now();
            LicenseModel.updateLicenseById(result)
                .then(function (r) {
                    return res.json({ code: 0, message: 'Activated Successfully', licenseId: result._id.toString() });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

// POST /check 检查序列号
router.get('/check',checkLogin, function (req, res, next) {
    var license = req.query.license;
    LicenseModel.getLicenseByLicense(license)
        .then(function (result) {
            if(result==null){
                return res.json({ code: 10010, message: 'Invalid license' });
            }
            return res.json({ code: 0, message: 'Successfully', license: result });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});
module.exports = router;