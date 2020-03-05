var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { Connection } = require("./db/Mongolib");
const middleware = require("./Autentication/middleware");
const cors = require("cors");

/**
 * Routers
 */
var usersRouter = require('./routes/users.js');
var pagaresRouter = require('./routes/pagares.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'front/build')));

/**
 * Routers use
 */
app.use('/users', usersRouter);
app.use('/pagares', pagaresRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

const PORT = normalizePort("5000");



app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
  Connection.connectToMongo();
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val; // pipe
  }
  if (port >= 0) {
    return port; // port
  }
  return false;
}

module.exports = app;
