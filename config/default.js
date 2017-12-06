module.exports = {
    //port: 8090,
    port: 666,
    session: {
      secret: 'tup-ucenter',
      key: 'tup-ucenter',
      maxAge: 2592000000
    },
    mongodb: 'mongodb://127.0.0.1:27017/tup-ucenter',
    //mongodb: 'mongodb://192.168.0.136:27017/tup-ucenter',
    jwtTokenSecret:'tup123456'
  };