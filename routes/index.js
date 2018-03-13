module.exports = function (app) {
  app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
  });

  app.get('/', function (req, res) {
    res.redirect('/index');
  });
  app.use('/users', require('./users'));
  app.use('/sessions', require('./sessions'));
  app.use('/token', require('./token'));
  app.use('/sysuser', require('./sysuser'));
  app.use('/book', require('./book'));
  app.use('/license', require('./license'));
  app.use('/batch', require('./batch'));
  app.use('/table', require('./table'));
  app.use('/oauth', require('./oauth'));
  // 404 page
  app.use(function (req, res) {
    if (!res.headersSent) {
      res.status(404).json({ message: 'not find' });
    }
  });
};