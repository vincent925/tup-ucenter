var Book = require('../lib/mongo').Book;

module.exports = {
  // 创建一本书
  create: function create(book) {
    return Book.create(book).exec();
  },
  //获取所有图书
  getAllBook: function getAllBook() {
    return Book
      .find()
      .addCreatedAt()
      .exec();
  },
  //根据ID获取一本图书
  getBookById: function getBookById(id) {
    return Book
      .findOne({ _id: id })
      .addCreatedAt()
      .exec();
  },
  //修改
  updateBookById: function updateBookById(id, data) {
      return Book.update({ _id: id }, { $set: data }).exec();
  }

};