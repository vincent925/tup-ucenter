module.exports = {
    port: 80,
    session: {
      secret: 'tup-ucenter',
      key: 'tup-ucenter',
      maxAge: 2592000000
    },
    mongodb: 'mongodb://127.0.0.1:27017/tup-ucenter',
    jwtTokenSecret:'tup123456'
  };