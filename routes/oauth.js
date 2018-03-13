var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var SysUserModel = require('../models/sysusers');
var checkLogin = require('../middlewares/check').checkLogin;
var base64 = require('base64-utf8');
var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('config-lite')(__dirname);
var UserModel = require('../models/users');
var http = require('http');
var qs = require('querystring');

//jwt参考文章：http://blog.csdn.net/cruise_h/article/details/50888225

//http://www.wqketang.com/oauth/v2/authorize?client_id=dkIzhixue&response_type=code
//&redirect_uri=http://dk.izhixue.cn/signup/callback&scope=fulltrust&state=dkIzhixue&_target_type=weixinweb

// GET /发起认证
router.get('/authorize', function (req, res, next) {
    var client_id = req.query.client_id;
    var redirect_uri = req.query.redirect_uri;
    var user_id = req.query.user_id;
    SysUserModel.getUserByName(client_id)
        .then(function (result) {
            if (result == null) {
                return res.status(401).json({ code: 12001, message: "Website not find" });
            }
            else {
                if (result.url == redirect_uri) {
                    var timestamp = Math.round(new Date().getTime() / 1000);
                    var encodeString = base64.encode(result.secret + timestamp);

                    var ut = {};
                    ut.code = encodeString;
                    ut.userId = user_id;
                    UserModel.createut(ut);

                    http.get(redirect_uri + "?code=" + encodeString, function (res) {
                        console.log("Got response: " + res.statusCode);
                    }).on('error', function (e) {
                        console.log("Got error: " + e.message);
                    });
                    return res.json({ code: 0, message: 'Successfully' });
                }
                else {
                    return res.status(401).json({ code: 12003, message: "redirect_uri error" });
                }
            }
        }).catch(next);
});

// POST 获取访问令牌
router.post('/token', function (req, res, next) {
    var client_id = req.body.client_id;
    var client_secret = req.body.client_secret;
    var redirect_uri = req.body.redirect_uri;
    var auth_code = req.body.auth_code;
    UserModel.getUtByCode(auth_code)
        .then(function (ut) {
            if (!ut) {
                return res.status(401).send({ code: 12004, message: 'auth_code error' });
            }
            else {
                var user_id = ut.userId;
                SysUserModel.getUserByName(client_id)
                    .then(function (result) {
                        if (result == null) {
                            return res.status(401).json({ code: 12001, message: "Website not find" });
                        }
                        else {
                            if (result.secret == client_secret) {
                                if (result.url == redirect_uri) {
                                    //签名解码
                                    var decodeString;
                                    try {
                                        decodeString = base64.decode(auth_code);
                                    } catch (e) {
                                        return res.json({ code: 12004, message: 'auth_code error' });
                                    }
                                    var secret = decodeString.substring(0, 16);
                                    var timestamp = parseInt(decodeString.substring(16, decodeString.length));
                                    //时间戳计算，与当前时间差
                                    var unixTimestamp = new Date(timestamp * 1000);
                                    var endtime = new Date();
                                    var date = endtime.getTime() - unixTimestamp.getTime();
                                    if (date > 600000) {
                                        return res.json({ code: 12004, message: 'auth_code error' });
                                    }
                                    else {
                                        var expires = moment().add('minutes', 60).valueOf();
                                        var token = jwt.encode({
                                            iss: user_id,
                                            exp: expires
                                        }, config.jwtTokenSecret);
                                        return res.json({ code: 0, message: 'Successfully', access_token: token });
                                    }
                                }
                                else {
                                    return res.status(401).json({ code: 12003, message: "redirect_uri error" });
                                }
                            }
                            else {
                                return res.status(401).json({ code: 12002, message: "secret error" });
                            }
                        }
                    }).catch(next);
            }
        })


});

// GET 验证令牌
router.post('/verify', function (req, res, next) {
    var client_id = req.body.client_id;
    var client_secret = req.body.client_secret;
    var redirect_uri = req.body.redirect_uri;
    var auth_code = req.body.auth_code;
    var access_token = req.body.access_token;
    SysUserModel.getUserByName(client_id)
        .then(function (result) {
            if (result == null) {
                return res.status(401).json({ code: 12001, message: "Website not find" });
            }
            else {
                if (result.secret == client_secret) {
                    if (result.url == redirect_uri) {
                        //下面的方法跟上面重复，可重构
                        var decodeString;
                        try {
                            decodeString = base64.decode(auth_code);
                        } catch (e) {
                            return res.json({ code: 12004, message: 'auth_code error' });
                        }
                        var secret = decodeString.substring(0, 16);
                        var timestamp = parseInt(decodeString.substring(16, decodeString.length));
                        var unixTimestamp = new Date(timestamp * 1000);
                        var endtime = new Date();
                        var date = endtime.getTime() - unixTimestamp.getTime();
                        if (date > 600000) {
                            return res.json({ code: 12004, message: 'auth_code error' });
                        }
                        else {
                            var decoded;
                            try {
                                decoded = jwt.decode(access_token, config.jwtTokenSecret);
                            } catch (e) {
                                return res.status(401).send({ code: 12005, message: 'token error' });
                            }
                            UserModel.getUserById(decoded.iss)
                                .then(function (user) {
                                    if (!user) {
                                        return res.status(401).send({ code: 12005, message: 'token error' });
                                    }
                                    else {
                                        return res.json({ code: 0, message: 'Successfully', client_id: client_id, user_id: user._id });
                                    }
                                })

                        }

                    }
                    else {
                        return res.status(401).json({ code: 12003, message: "redirect_uri error" });
                    }
                }
                else {
                    return res.status(401).json({ code: 12002, message: "secret error" });
                }
            }
        }).catch(next);
});

module.exports = router;