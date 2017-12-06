var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var SysUserModel = require('../models/sysusers');
var UserModel = require('../models/users');
var moment = require('moment');
var config = require('config-lite')(__dirname);
var base64 = require('base64-utf8');

// GET /signin 登录页
router.get('/', function (req, res, next) {
    var token = req.query.ssotoken;
    var decoded = jwt.decode(token, config.jwtTokenSecret);
    return res.json({ code: 0, message: decoded });
});
router.get('/getsign', function (req, res, next) {
    var userId = req.query.userId;
    SysUserModel.getUserById(userId)
        .then(function (user) {
            if (!user) {
                return res.json({ code: 10003, message: 'User not find' });
            }
            var timestamp = Math.round(new Date().getTime() / 1000);
            var encodeString = base64.encode(user.secret + timestamp);
            return res.json({ code: 0, message: 'Successfully', timestamp: timestamp, secret: user.secret, userId: userId, sign: encodeString });
        })
        .catch(next);

});
// POST /create 创建token
router.get('/create', function (req, res, next) {
    var userId = req.query.userId;
    var sign = req.query.sign;
    //签名解码
    var decodeString;
    try {
        decodeString = base64.decode(sign);
    } catch (e) {
        return res.json({ code: 10004, message: 'Sign error' });
    }
    var secret = decodeString.substring(0, 16);
    var timestamp = parseInt(decodeString.substring(16, decodeString.length));
    //时间戳计算，与当前时间差
    var unixTimestamp = new Date(timestamp * 1000);
    var endtime = new Date();
    var date = endtime.getTime() - unixTimestamp.getTime();
    if (date > 60000) {
        return res.json({ code: 10005, message: 'Timestamp error' });
    }
    SysUserModel.getUserById(userId)
        .then(function (user) {
            if (!user) {
                return res.json({ code: 10003, message: 'User not find' });
            }
            if (secret !== user.secret) {
                return res.json({ code: 10006, message: 'Secret is not correct' });
            }
            var expires = moment().add('minutes', 1).valueOf();
            var token = jwt.encode({
                iss: userId,
                exp: expires
            }, config.jwtTokenSecret);
            return res.json({ code: 0, message: 'Successfully', token: token });
        })
        .catch(next);

});
router.get('/user/getsign', function (req, res, next) {
    var userId = req.query.userId;
    UserModel.getUserById(userId)
        .then(function (user) {
            if (!user) {
                return res.json({ code: 10003, message: 'User not find' });
            }
            var timestamp = Math.round(new Date().getTime() / 1000);
            if (user.type == 'wechat') {
                var encodeString = base64.encode(user.openid + timestamp);
                return res.json({ code: 0, message: 'Successfully', timestamp: timestamp, secret: user.openid, userId: userId, sign: encodeString });
            }
            else {
                var encodeString = base64.encode(user.password + timestamp);
                return res.json({ code: 0, message: 'Successfully', timestamp: timestamp, secret: user.password, userId: userId, sign: encodeString });
            }

        })
        .catch(next);

});
// POST /user/create 创建token
router.get('/user/create', function (req, res, next) {
    var userId = req.query.userId;
    var sign = req.query.sign;
    //签名解码
    var decodeString;
    try {
        decodeString = base64.decode(sign);
    } catch (e) {
        return res.json({ code: 10004, message: 'Sign error' });
    }
    
    var timestamp = parseInt(decodeString.substring(16, decodeString.length));
    //时间戳计算，与当前时间差
    var unixTimestamp = new Date(timestamp * 1000);
    var endtime = new Date();
    var date = endtime.getTime() - unixTimestamp.getTime();
    if (date > 60000) {
        return res.json({ code: 10005, message: 'Timestamp error' });
    }
    UserModel.getUserById(userId)
        .then(function (user) {
            if (!user) {
                return res.json({ code: 10003, message: 'User not find' });
            }
            if (user.type == 'wechat') {
                var secret = decodeString.substring(0, user.openid.length);
                if (secret !== user.openid) {
                    return res.json({ code: 10006, message: 'Secret is not correct' });
                }
                var expires = moment().add('minutes', 1).valueOf();
                var token = jwt.encode({
                    iss: userId,
                    exp: expires
                }, config.jwtTokenSecret);
                return res.json({ code: 0, message: 'Successfully', token: token });
            }
            else {
                var secret = decodeString.substring(0, user.password.length);
                if (secret !== user.password) {
                    return res.json({ code: 10006, message: 'Secret is not correct' });
                }
                var expires = moment().add('minutes', 1).valueOf();
                var token = jwt.encode({
                    iss: userId,
                    exp: expires
                }, config.jwtTokenSecret);
                return res.json({ code: 0, message: 'Successfully', token: token });
            }

        })
        .catch(next);

});

module.exports = router;