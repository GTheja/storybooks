const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('./config/db');

dotenv.config({path: './config/config.env'});

//passport config.
require('./config/passport')(passport)

connectDB()
const app = express();

//bodu parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//logging
if(process.env.NODE_ENV == 'development'){
    app.use(morgan('dev'));
}

//handlebars helpers

const { formatDate , stripTags, truncate, editIcon } = require('./helpers/hbs')

//handlebars
app.engine('.hbs', exphbs({helpers:{
  formatDate,
  stripTags,
  truncate,
  editIcon
} ,defaultLayout:'main' ,extname: '.hbs'}));
app.set('view engine', '.hbs');

//sessions
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}))

//passport middleware..
app.use(passport.initialize());
app.use(passport.session());

//set global var
app.use(function(req, res, next) {
  res.locals.user = req.user || null
  next()
})


//static connection
app.use(express.static(path.join(__dirname, 'public')))
//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`));