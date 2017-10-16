var Batch = require('../lib/mongo').Batch;

module.exports = {
  // 创建一个批次号
  create: function create(b) {
    return Batch.create(b).exec();
  },
  //根据图书获取所有批次号
  getAllBatchBybookId: function getAllBatchBybookId(bookId) {
    return Batch
      .find({ bookId: bookId })
      .addCreatedAt()
      .exec();
  },
  //根据用户获取所有批次号
  getAllBatchByuserId: function getAllBatchByuserId(userId) {
    return Batch
      .find({ createUser: userId })
      .addCreatedAt()
      .exec();
  },
  //根据ID获取一批次号
  getBatchById: function getBatchById(id) {
    return Batch
      .findOne({ _id: id })
      .addCreatedAt()
      .exec();
  },
  //修改批次号
  updateBatchById: function updateBatchById(id, data) {
      return Batch.update({ _id: id }, { $set: data }).exec();
  }

};