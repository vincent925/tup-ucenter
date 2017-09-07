var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var SysUserModel = require('../models/sysusers');
var moment = require('moment');
var config = require('config-lite')(__dirname);
var base64 = require('base64-utf8');

// GET /signin 登录页
router.get('/', function (req, res, next) {
    var token = req.query.ssotoken;
    var decoded = jwt.decode(token, config.jwtTokenSecret);
    return res.json({ message: decoded });
});
router.get('/getsign', function (req, res, next) {
    var userkey = req.query.userkey;
    SysUserModel.getUserById(userkey)
        .then(function (user) {
            if (!user) {
                return res.json({ message: 'User not find' });
            }
            var timestamp = Math.round(new Date().getTime() / 1000);
            var encodeString = base64.encode(user.secret + timestamp);
            return res.json({ message: 'Successfully', timestamp: timestamp, secret: user.secret, userkey: userkey, sign: encodeString });
        })
        .catch(next);

});
// POST /create 创建token
router.get('/create', function (req, res, next) {
    var userkey = req.query.userkey;
    var sign = req.query.sign;
    //签名解码
    var decodeString;
    try {
        decodeString = base64.decode(sign);
    } catch (e) {
        return res.json({ message: 'Sign error' });
    }
    var secret = decodeString.substring(0, 16);
    var timestamp = parseInt(decodeString.substring(16, decodeString.length));
    //时间戳计算，与当前时间差
    var unixTimestamp = new Date(timestamp * 1000);
    var endtime = new Date();
    var date = endtime.getTime() - unixTimestamp.getTime();
    if (date > 60000) {
        return res.json({ message: 'Timestamp error' });
    }
    SysUserModel.getUserById(userkey)
        .then(function (user) {
            if (!user) {
                return res.json({ message: 'User not find' });
            }
            if (secret !== user.secret) {
                return res.json({ message: 'Secret is not correct' });
            }
            var expires = moment().add('minutes', 1).valueOf();
            var token = jwt.encode({
                iss: userkey,
                exp: expires
            }, config.jwtTokenSecret);
            return res.json({ token: token, message: 'Successfully' });
        })
        .catch(next);

});

module.exports = router;