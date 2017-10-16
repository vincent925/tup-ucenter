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
    var openid = req.body.openid;
    var site = req.body.site;
    var ip = req.body.ip;
    if (password != undefined) {
        if (password.length < 6) {
            return res.status(400).send({
                code: 10001,
                message: '密码至少 6 个字符'
            });
        }
        password = sha1(password);
    }

    if (email != undefined) {
        if (email.length < 6) {
            return res.status(400).send({
                code: 10002,
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
    if (openid != undefined) {
        u.openid = openid;
    }
    if (site != undefined) {
        u.site = site;
    }
    if (ip != undefined) {
        u.ip = ip;
    }
    if (name != undefined) {
        UserModel.getUserByEmail(u.email)
            .then(function (u1) {
                if (u1 != null) {
                    return res.json({ code: 10008, message: 'User already exists' });
                }
                else {
                    UserModel.create(u)
                        .then(function (result) {
                            user = result.ops[0];
                            return res.json({ code: 0, message: 'Successfully', userId: user._id });
                        })
                        .catch(function (e) {
                            return res.status(401).json({ code: 10000, message: e.message });
                        });
                }
            })
            .catch(function (e) {
                return res.status(401).json({ code: 10000, message: e.message });
            });
    }
    else {
        UserModel.getUserByOpenid(openid)
            .then(function (u1) {
                if (u1 != null) {
                    return res.json({ code: 10008, message: 'User already exists' });
                }
                else {
                    UserModel.create(u)
                        .then(function (result) {
                            user = result.ops[0];
                            return res.json({ code: 0, message: 'Successfully', userId: user._id });
                        })
                        .catch(function (e) {
                            return res.status(401).json({ code: 10000, message: e.message });
                        });
                }
            })
            .catch(function (e) {
                return res.status(401).json({ code: 10000, message: e.message });
            });
    }
});
router.post('/update', checkLogin, function (req, res, next) {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var avatar = req.body.avatar;
    var gender = req.body.gender;
    var type = req.body.type;
    var openid = req.body.openid;
    var site = req.body.site;
    var ip = req.body.ip;
    if (password != undefined) {
        if (password.length < 6) {
            return res.status(400).send({
                code: 10001,
                message: '密码至少 6 个字符'
            });
        }
        password = sha1(password);
    }

    if (email != undefined) {
        if (email.length < 6) {
            return res.status(400).send({
                code: 10002,
                message: 'email至少 6 个字符'
            });
        }
    }

    UserModel.getUserById(id)
        .then(function (u) {
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
            if (openid != undefined) {
                u.openid = openid;
            }
            if (site != undefined) {
                u.site = site;
            }
            if (ip != undefined) {
                u.ip = ip;
            }
            UserModel.updateUserById(id, u)
                .then(function (result) {
                    return res.json({ code: 0, message: 'Successfully', userId: id });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });

});
router.get('/', checkLogin, function (req, res, next) {
    var id = req.query.id;
    UserModel.getUserById(id)
        .then(function (user) {
            delete user.password;
            return res.json({ code: 0, message: 'Successfully', user: user });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});
module.exports = router;