var User = require('../lib/mongo').User;
var User_temp = require('../lib/mongo').User_temp;

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
  getAllUsers: function getAllUsers() {
    
    return User
      .find()
      .addCreatedAt()
      .exec();
  },
  getUserById: function getUserById(id) {
    return User
      .findOne({ _id: id })
      .addCreatedAt()
      .exec();
  },
  getUserByOpenid: function getUserByOpenid(openid) {
    var orQuery1 = {};
    if (openid) {
      orQuery1.openid = openid;
    }
    return User
      .findOne(orQuery1)
      .addCreatedAt()
      .exec();
  },
  getUserByUnionid: function getUserByUnionid(unionid) {
    var orQuery1 = {};
    if (unionid) {
      orQuery1.unionid = unionid;
    }
    return User
      .findOne(orQuery1)
      .addCreatedAt()
      .exec();
  },
  getUserByOpenidAndUnionid: function getUserByOpenidAndUnionid(openid,unionid) {
    var orQuery1 = {};
    if (openid) {
      if(unionid)
      {
        orQuery1.openid = openid;
        orQuery1.unionid = unionid;
      }
    }
    return User
      .findOne(orQuery1)
      .addCreatedAt()
      .exec();
  },
  getUserBySiteAndUnionid: function getUserBySiteAndUnionid(site,unionid) {
    var orQuery = {};
    if (site) {
      if(unionid)
      {
        orQuery.site = site;
        orQuery.unionid = unionid;
      }
    }
    return User
      .findOne(orQuery)
      .addCreatedAt()
      .exec();
  },
  //修改
  updateUserById: function updateUserById(id, data) {
      return User.update({ _id: id }, { $set: data }).exec();
  },
  //根据手机号找人
  getUserByPhone: function getUserByPhone(phone) {
    var orQuery = {};
    if (phone) {
      orQuery.phone = phone;
    }
    return User
      .findOne(orQuery)
      .addCreatedAt()
      .exec();
  },
  //
  createut: function createut(ut) {
    return User_temp.create(ut).exec();
  },
  getUtByCode: function getUtByCode(code) {
    var orQuery1 = {};
    if (code) {
      orQuery1.code = code;
    }
    return User_temp
      .findOne(orQuery1)
      .addCreatedAt()
      .exec();
  }
};