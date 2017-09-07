var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var checkLogin = require('../middlewares/check').checkLogin;

// POST /signin 用户注册
router.post('/create', checkLogin, function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var avatar = req.body.avatar;
    var gender = req.body.gender;
    var type = req.body.type;
    var accesstoken = req.body.accesstoken;
    var openid = req.body.openid;
    var site = req.body.site;
    var ip = req.body.ip;
    if (password != undefined) {
        if (password.length < 6) {
            return res.status(400).send({
                message: '密码至少 6 个字符'
            });
        }
        password = sha1(password);
    }

    if (email != undefined) {
        if (email.length < 6) {
            return res.status(400).send({
                message: 'email至少 6 个字符'
            });
        }
    }


    var u = {};
    if (name != undefined) {
        u.name = name;
    }
    if (password != undefined) {
        u.password = password;
    }
    if (avatar != undefined) {
        u.avatar = avatar;
    }
    if (email != undefined) {
        u.email = email;
    }
    if (gender != undefined) {
        u.gender = gender;
    }
    if (type != undefined) {
        u.type = type;
    }
    if (accesstoken != undefined) {
        u.accesstoken = accesstoken;
    }
    if (openid != undefined) {
        u.openid = openid;
    }
    if (site != undefined) {
        u.site = site;
    }
    if (ip != undefined) {
        u.ip = ip;
    }
    UserModel.create(u)
        .then(function (result) {
            user = result.ops[0];
            return res.json({ message: 'Successfully', userKey: user._id });
        })
        .catch(function (e) {
            return res.json({ message: e });
        });
});

module.exports = router;