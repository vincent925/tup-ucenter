var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var UserModel = require('../models/users');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /signin 登录页
router.get('/', function (req, res, next) {

    return res.json({ message: sha1('kaifazhe') });
});

// POST /create 用户登录
router.post('/create', checkLogin, function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    UserModel.getUserByEmail(email)
        .then(function (user) {
            if (!user) {
                //req.flash('error', '用户不存在');
                return res.json({ code: 10003, message: 'User not find' });
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                //req.flash('error', '用户名或密码错误');
                return res.json({ code: 10007, message: 'Password is not correct' });
            }
            return res.json({ code: 0, message: 'Login successfully', userId: user._id });
        })
        .catch(next);
});

router.post('/wechat/create', function (req, res, next) {
    var openid = req.body.openid;
    var unionid = req.body.unionid;
    UserModel.getUserByOpenid(openid)
        .then(function (user) {
            if (!user) {
                //req.flash('error', '用户不存在');
                return res.json({ code: 10003, message: 'User not find' });
            }
            if(unionid!=null){
                user.unionid = unionid;
                UserModel.updateUserById(user._id.toString(),user)
                    .then(function (user) {
                        return res.json({ code: 0, message: 'Login successfully', userId: user._id });
                    })
                    .catch(next);
            }
            return res.json({ code: 0, message: 'Login successfully', userId: user._id });

        })
        .catch(next);
});
module.exports = router;