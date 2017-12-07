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
      .findOne({ bookId: id })
      .addCreatedAt()
      .exec();
  },
  //修改
  updateBookById: function updateBookById(id, data) {
    return Book.update({ bookId: id }, { $set: data }).exec();
  },
  delBookById: function delBookById(bookId) {
    return Book.remove({ bookId: bookId }).exec();
  },
  searchEbooks: function searchEbooks(search,page, count) {
    var query = {};
    var orQuery1 = {};
    var orQuery2 = {};
    var orQuery3 = {};
    var orQuery4 = {};
    var orQuery5 = {};
    var qs = new RegExp(search);
    if (search) {
      orQuery1.bookId = qs;
      orQuery2.bookname = qs;
      orQuery3.branch = qs;
      orQuery4.editor = qs;
      orQuery5.author = qs;
    }
    return Book
      .find({ '$or': [orQuery1, orQuery2, orQuery3, orQuery4, orQuery5]}).skip((page - 1) * count).limit(count);
  },
  searchEbooksCount: function searchEbooksCount(search) {
    var query = {};
    var orQuery1 = {};
    var orQuery2 = {};
    var orQuery3 = {};
    var orQuery4 = {};
    var orQuery5 = {};
    var qs = new RegExp(search);
    if (search) {
      orQuery1.bookId = qs;
      orQuery2.bookname = qs;
      orQuery3.branch = qs;
      orQuery4.editor = qs;
      orQuery5.author = qs;
    }
    return Book
      .count({ '$or': [orQuery1, orQuery2, orQuery3, orQuery4, orQuery5]});
  }
};