var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var UserModel = require('../models/users');
var UserExModel = require('../models/userex');
var checkLogin = require('../middlewares/check').checkLogin;
var crypto = require('crypto');
var config = require('config-lite')(__dirname);
var moment = require('moment');

// POST /signin 用户注册
router.post('/create', function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var phone = req.body.phone;
    var password = req.body.password;
    var avatar = req.body.avatar;
    var gender = req.body.gender;
    var type = req.body.type;
    var openid = req.body.openid;
    var unionid = req.body.unionid;
    var site = req.body.site;
    var ip = req.body.ip;
    if (password != undefined) {
        //     if (password.length < 6) {
        //         return res.status(400).send({
        //             code: 10001,
        //             message: '密码至少 6 个字符'
        //         });
        //     }
        password = sha1(password);
    }

    // if (email != undefined) {
    //     if (email.length < 6) {
    //         return res.status(400).send({
    //             code: 10002,
    //             message: 'email至少 6 个字符'
    //         });
    //     }
    // }

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
    if (phone != undefined) {
        u.phone = phone;
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
    if (unionid != undefined) {
        u.unionid = unionid;
    }
    if (site != undefined) {
        u.site = site;
    }
    if (ip != undefined) {
        u.ip = ip;
    }
    if (type == "none") {
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
                    if (unionid != null) {
                        UserModel.getUserByUnionid(unionid)
                            .then(function (result) {
                                if (result != null) {
                                    //找不到openid但是有相同的unionid
                                    UserModel.getUserById(result._id.toString())
                                        .then(function (u) {
                                            var uex = {};
                                            uex.userId = result._id.toString();
                                            uex.type = type;
                                            uex.openid = openid;
                                            uex.unionid = unionid;
                                            uex.site = site;
                                            UserExModel.create(uex)
                                                .then(function (result) {
                                                    return res.json({ code: 0, message: 'Successfully', userId: uex.userId });
                                                })
                                                .catch(function (e) {
                                                    return res.status(401).json({ code: 10000, message: e.message });
                                                });
                                        })
                                        .catch(function (e) {
                                            return res.status(401).json({ code: 10000, message: e.message });
                                        });
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
                        UserModel.create(u)
                            .then(function (result) {
                                user = result.ops[0];
                                return res.json({ code: 0, message: 'Successfully', userId: user._id });
                            })
                            .catch(function (e) {
                                return res.status(401).json({ code: 10000, message: e.message });
                            });
                    }


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
    var phone = req.body.phone;
    var password = req.body.password;
    var avatar = req.body.avatar;
    var gender = req.body.gender;
    var type = req.body.type;
    var openid = req.body.openid;
    var unionid = req.body.unionid;
    var site = req.body.site;
    var ip = req.body.ip;
    if (password != undefined) {
        //     if (password.length < 6) {
        //         return res.status(400).send({
        //             code: 10001,
        //             message: '密码至少 6 个字符'
        //         });
        //     }
        password = sha1(password);
    }

    // if (email != undefined) {
    //     if (email.length < 6) {
    //         return res.status(400).send({
    //             code: 10002,
    //             message: 'email至少 6 个字符'
    //         });
    //     }
    // }

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
            if (phone != undefined) {
                u.phone = phone;
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
            if (unionid != undefined) {
                u.unionid = unionid;
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
router.get('/', function (req, res, next) {
    var id = req.query.id;
    UserModel.getUserById(id)
        .then(function (user) {
            if (user.password != undefined) {
                user.hasPwd = true;
            }
            else {
                user.hasPwd = false;
            }
            delete user.password;
            return res.json({ code: 0, message: 'Successfully', user: user });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });
});

//找回密码第一步
router.get('/findpwd', checkLogin, function (req, res, next) {
    var userId = req.query.userId;
    var timestamp = Math.round(new Date().getTime() / 1000);
    var str = timestamp + '|' + userId;
    ctpwd = encrypt(str);
    var url = 'ucenter.izhixue.cn:666/users/findPassword?userId=' + userId + '&ctpwd' + ctpwd;
    //发送邮件
});

//找回密码
router.get('/findPassword', checkLogin, function (req, res, next) {
    var userId = req.query.userId;
    var ctpwd = req.query.ctpwd;
    ctpwd = decrypt(ctpwd);
    var strs = new Array(); //定义一数组 
    strs = ctpwd.split("|");
    //检验签名和时间戳
    if (strs[1] == userId) {
        timestamp = strs[0];
        var unixTimestamp = new Date(timestamp * 1000);
        var endtime = new Date();
        var date = endtime.getTime() - unixTimestamp.getTime();
        if (date > 7200000) {
            // 跳转到签名验证失败页面
            return res.redirect('/signup');
        }
        UserModel.getUserById(userId)
            .then(function (user) {
                if (user != null) {
                    res.render('findPassword');
                }
            })
            .catch(function (e) {
                return res.status(401).json({ code: 10000, message: e.message });
            });
    }
    else {
        // 跳转到签名验证失败页面
        return res.redirect('/signup');
    }

});
//获取某用户的绑定信息
router.get('/getBindInfo', function (req, res, next) {
    var userId = req.query.userId;
    UserModel.getUserById(userId)
        .then(function (u) {
            UserExModel.getUserExByUserId(userId)
                .then(function (result) {
                    u.binds = result;
                    return res.json({ code: 0, message: 'Successfully', user: u });
                })
                .catch(function (e) {
                    return res.status(401).json({ code: 10000, message: e.message });
                });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });

});
//批量生成新模型
router.get('/allBind', function (req, res, next) {
    UserModel.getAllUsers()
        .then(function (users) {
            for (var i = 0; i < users.length; i++) {
                //users[i].code
                var uex = {};
                uex.userId = users[i]._id.toString();
                uex.type = users[i].type;
                uex.openid = users[i].openid;
                uex.unionid = users[i].unionid;
                uex.site = users[i].site;
                UserExModel.create(uex);
            }
            return res.json({ code: 0, message: 'Successfully' });
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });

});
//绑定微信号
router.post('/bind', function (req, res, next) {
    var id = req.body.id;
    var openid = req.body.openid;
    var unionid = req.body.unionid;
    var type = req.body.type;
    var site = req.body.site;
    UserModel.getUserByOpenidAndUnionid(openid, unionid)
        .then(function (result) {
            if (result == null) {
                UserModel.getUserById(id)
                    .then(function (u) {
                        var uex = {};
                        uex.userId = id;
                        uex.type = type;
                        uex.openid = openid;
                        uex.unionid = unionid;
                        uex.site = site;
                        UserExModel.create(uex)
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
            }
            else {
                return res.status(401).json({ code: 10011, message: e.message });
            }
        })
        .catch(function (e) {
            return res.status(401).json({ code: 10000, message: e.message });
        });


});

// POST /findPassword 找回密码
router.post('/findPassword', function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    // 校验参数
    try {
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        return res.redirect('back');
    }
    // 明文密码加密
    password = sha1(password);
    UserModel.getUserByEmail(email)
        .then(function (result) {
            if (result != null) {
                result.password = password;
                UserModel.updateUserById(result._id, result)
                    .then(function (result) {
                        user = result.ops[0];
                        // 跳转到修改密码成功页
                        return res.redirect('/signup');
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            }
            else {
                // 跳转到修改密码失败页
                return res.redirect('/signup');
            }
        })
        .catch(function (e) {
            console.log(e);
        });
});
module.exports = router;

function decrypt(str) {
    var decipher = crypto.createDecipher('aes192', config.session.secret);
    var dec = decipher.update(str, 'hex', 'utf8');//编码方式从hex转为utf-8;
    dec += decipher.final('utf8');//编码方式从utf-8;
    return dec;
}

function encrypt(str) {
    var cipher = crypto.createCipher('aes192', config.session.secret);
    var enc = cipher.update(str, 'utf8', 'hex');//编码方式从utf-8转为hex;
    enc += cipher.final('hex');//编码方式从转为hex;
    return enc;
}