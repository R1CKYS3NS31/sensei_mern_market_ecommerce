var createError = require("http-errors");
var express = require("express");
const cors = require('cors')
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const { default: mongoose } = require("mongoose");

// route  paths
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// database
const URL = "mongodb://localhost:27017/senseimernsetup"

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // autoIndex: false, // Don't build indexes
  maxPoolSize: 10,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
}

mongoose.set("strictQuery", true)
mongoose
  .connect(process.env.MONGO_URL || URL, this.options)// emit options on host
  .then(() => console.log("DB connected successfully!")).catch((err) => console.error(err))

// routes
app.use('/', indexRouter);
app.use('/user', usersRouter);

// api routes

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
