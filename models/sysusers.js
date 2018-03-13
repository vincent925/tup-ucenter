var SysUser = require('../lib/mongo').SysUser;

module.exports = {
    // 注册一个用户
    create: function create(user) {
        return SysUser.create(user).exec();
    },
    getUserByEmail: function getUserByEmail(email) {
        var orQuery1 = {};
        if (email) {
            orQuery1.email = email;
        }
        return SysUser
            .findOne(orQuery1)
            .addCreatedAt()
            .exec();
    },
    getUserByName: function getUserByName(name) {
        var orQuery1 = {};
        if (name) {
            orQuery1.name = name;
        }
        return SysUser
            .findOne(orQuery1)
            .addCreatedAt()
            .exec();
    },
    getUserById: function getUserById(id) {
        return SysUser
            .findOne({ _id: id })
            .addCreatedAt()
            .exec();
    },
    searchAllUsers: function searchAllUsers() {
        
        return SysUser
            .find();
    }

};