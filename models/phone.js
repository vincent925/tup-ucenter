var Phone_temp = require('../lib/mongo').Phone_temp;

module.exports = {
  // 创建
  create: function create(pt) {
    return Phone_temp.create(pt).exec();
  },
  getPhoneTempByPhone: function getPhoneTempByPhone(phone) {
    var orQuery = {};
    if (phone) {
      orQuery.phone = phone;
    }
    return Phone_temp
      .findOne(orQuery)
      .addCreatedAt()
      .exec();
  }
};