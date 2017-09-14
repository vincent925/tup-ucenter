var User = require('../lib/mongo').User;

module.exports = {
  // 注册一个用户
  create: function create(user) {
    return User.create(user).exec();
  },
  getUserByEmail: function getUserByEmail(email) {
    var orQuery1 = {};
    if (email) {
      orQuery1.email = email;
    }
    return User
      .findOne(orQuery1)
      .addCreatedAt()
      .exec();
  },
  getUserById: function getUserById(id) {
    return User
      .findOne({ _id: id })
      .addCreatedAt()
      .exec();
  },
  getUserByAccesstoken: function getUserByAccesstoken(accesstoken) {
    var orQuery1 = {};
    if (accesstoken) {
      orQuery1.accesstoken = accesstoken;
    }
    return User
      .findOne(orQuery1)
      .addCreatedAt()
      .exec();
  },
  //修改
  updateUserById: function updateUserById(id, data) {
      return User.update({ _id: id }, { $set: data }).exec();
  }

};