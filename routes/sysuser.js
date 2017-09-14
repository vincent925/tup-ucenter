var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var SysUserModel = require('../models/sysusers');
var checkLogin = require('../middlewares/check').checkLogin;

// GET /signin 登录页
router.get('/', function (req, res, next) {
    res.render('signup');
});
router.get('/getall', function (req, res, next) {
    SysUserModel.searchAllUsers()
    .then(function (result) {
        return res.json({ code: 0,users: result });
    })
    .catch(function (e) {
        console.log(e);
    });
});
function randomWord(randomFlag, min, max) {
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    // 随机产生
    if (randomFlag) {
        range = Math.round(Math.random() * (max - min)) + min;
    }
    for (var i = 0; i < range; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
    }
    return str;
}
// POST /signin 用户注册
router.post('/create', function (req, res, next) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var repassword = req.body.repassword;
    var secret = randomWord(false, 16);
    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字请限制在 1-10 个字符');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
    } catch (e) {
        return res.redirect('/signin');
    }
    // 明文密码加密
    password = sha1(password);
    SysUserModel.getUserByEmail(email)
        .then(function (result) {
            if (result == null) {
                var u = {
                    nickname: name,
                    password: password,
                    email: email,
                    secret: secret
                };
                SysUserModel.create(u)
                    .then(function (result) {
                        user = result.ops[0];
                        // 跳转到首页
                        res.redirect('/');
                    })
                    .catch(function (e) {
                        console.log(e);
                    });
            }
            else {
                return res.redirect('/signup');
            }
        })
        .catch(function (e) {
            console.log(e);
        });
});

module.exports = router;