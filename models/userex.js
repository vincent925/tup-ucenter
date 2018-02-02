var UserEx = require('../lib/mongo').UserEx;

module.exports = {
  // 创建一个用户ex
  create: function create(userex) {
    return UserEx.create(userex).exec();
  },
  getUserExByUserId: function getUserExByUserId(userid) {
    return UserEx
      .find({ userId: userid })
      .addCreatedAt()
      .exec();
  },
  //修改
  updateUserExByUserId: function updateUserExByUserId(userid, data) {
      return User.update({ userId: userid }, { $set: data }).exec();
  }
};