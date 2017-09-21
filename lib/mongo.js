var config = require('config-lite')(__dirname);
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function (result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});
exports.SysUser = mongolass.model('SysUser', {
  name: { type: 'string' },
  email: { type: 'string' },
  password: { type: 'string' },
  secret: { type: 'string' }
});
exports.SysUser.index({ email: 1 }).exec();

exports.User = mongolass.model('User', {
  name: { type: 'string' },
  email: { type: 'string' },
  password: { type: 'string' },
  avatar: { type: 'string' },
  gender: { type: 'string', enum: ['m', 'f', 'x'] },
  type: { type: 'string', enum: ['none', 'qq', 'wechat', 'weibo'] },
  openid: { type: 'string' },
  site: { type: 'string' },
  ip: { type: 'string' }
});

exports.Book = mongolass.model('Book', {
  bookId: { type: 'string' },
  subjectId: { type: Number },
  bookname: { type: 'string' },
  price: { type: Number },
  ISBN: { type: Number }
});

exports.License = mongolass.model('License', {
  bookId: { type: 'string' },
  batchId:{ type: 'string' },
  code: { type: 'string' },
  state: { type: 'string' , enum: ['notActive', 'activated']},
  CreateDateTime: { type: Date },
  ActivateDateTime: { type: Date },
  ActivateUserID: { type: 'string' },
  ValiditySecond: { type: Number },
  createUser:{ type: 'string' }
});

exports.Batch = mongolass.model('Batch', {
  bookId: { type: 'string' },
  count: { type: Number },
  createUser:{ type: 'string' }
});
//serial number