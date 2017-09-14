module.exports = function (app) {
    app.get('/', function (req, res) {
      res.redirect('/index');
    });
    app.use('/users', require('./users'));
    app.use('/sessions', require('./sessions'));
    app.use('/token', require('./token'));
    app.use('/sysuser', require('./sysuser'));
    // 404 page
    app.use(function (req, res) {
      if (!res.headersSent) {
        res.status(404).json({ message: 'not find' });
      }
    });
  };