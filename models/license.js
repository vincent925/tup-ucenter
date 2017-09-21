var License = require('../lib/mongo').License;

module.exports = {
  // 创建一个序列号
  create: function create(l) {
    return License.create(l).exec();
  },
  //根据图书获取所有序列号
  getAllLicenseBybookId: function getAllLicenseBybookId(bookId) {
    return License
      .find({ bookId: bookId })
      .addCreatedAt()
      .exec();
  },
  //根据批次号获取所有序列号
  getAllLicenseBybatchId: function getAllLicenseBybatchId(batchId) {
    return License
      .find({ batchId: batchId })
      .addCreatedAt()
      .exec();
  },
  //根据ID获取一序列号
  getLicenseById: function getLicenseById(id) {
    return License
      .findOne({ _id: id })
      .addCreatedAt()
      .exec();
  },
  //修改序列号
  updateLicenseById: function updateLicenseById(id, data) {
      return License.update({ _id: id }, { $set: data }).exec();
  },
  //根据License获取一序列号
  getLicenseByLicense: function getLicenseByLicense(license) {
    return License
      .findOne({ code: license })
      .addCreatedAt()
      .exec();
  }

};