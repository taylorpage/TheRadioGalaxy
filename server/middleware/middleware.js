const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

module.exports = function (app, express) {
  app.set('views', __dirname + '/../views');
  app.set('view engine', 'jade');
  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(__dirname + '/../../client'));
};
