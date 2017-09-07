var jwt = require('jwt-simple');
var SysUserModel = require('../models/sysusers');
var moment = require('moment');
var config = require('config-lite')(__dirname);

module.exports = {
    checkLogin: function checkLogin(req, res, next) {
        if (req.query.token != undefined) {
            var token = req.query.token;
            var decoded;
            try {
                decoded = jwt.decode(token, config.jwtTokenSecret);
            } catch (e) {
                return res.status(401).send({
                    success: false,
                    message: 'token验证失败！'
                });
            }
            SysUserModel.getUserById(decoded.iss)
            .then(function (user) {
                if (!user) {
                    return res.status(401).send({
                        success: false,
                        message: 'token验证失败！'
                    });
                }
            })
        }
        else {
            return res.status(403).send({
                success: false,
                message: '没有提供token！'
            });
        }
        next();
    }
};