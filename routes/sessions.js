var sha1 = require('sha1');
var express = require('express');
var router = express.Router();
var jwt = require('jwt-simple');
var UserModel = require('../models/users');
// GET /signin 登录页
router.get('/', function (req, res, next) {
    return res.json({ message: 'not find' });
});

// POST /create 用户登录
router.post('/create', function (req, res, next) {
    var email = req.fields.email;
    var password = req.fields.password;

    UserModel.getUserByEmail(email)
        .then(function (user) {
            if (!user) {
                //req.flash('error', '用户不存在');
                return res.json({ message: 'User not find' });
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                //req.flash('error', '用户名或密码错误');
                return res.json({ message: 'Password is not correct' });
            }
            var expires = moment().add('minutes', 10).valueOf();
            var token = jwt.encode({
              iss: user.id,
              exp: expires
            }, app.get('jwtTokenSecret'));
            //req.flash('success', '登录成功');
            // 用户信息写入 session
            return res.json({ token : token,message: 'Login successfully' });
        })
        .catch(next);
});

module.exports = router;