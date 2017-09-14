module.exports = {
    port: 3000,
    session: {
      secret: 'tup-ucenter',
      key: 'tup-ucenter',
      maxAge: 2592000000
    },
    mongodb: 'mongodb://192.168.0.129:27017/tup-ucenter',
    jwtTokenSecret:'tup123456'
  };