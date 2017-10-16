var Book = require('../lib/mongo').Book;

module.exports = {
  // 创建一本书
  create: function create(book) {
    return Book.create(book).exec();
  },
  //获取所有图书
  getAllBook: function getAllBook(page, count) {
    // return Book
    //   .find()
    //   .addCreatedAt()
    //   .exec();

    return Book
      .find().skip((page - 1) * count).limit(count)
      .addCreatedAt()
      .exec();
  },
  //获取所有图书数量
  getAllBookCount: function getAllBookCount() {
    return Book
      .count();
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