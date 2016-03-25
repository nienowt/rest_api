'use strict';

let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:db');

let router = express.Router();
let publicRouter = express.Router();

require('./routes/human-route')(router);
require('./routes/ghost-route')(router);
require('./routes/login-route')(publicRouter);


app.use(bodyParser.json());
app.use('/api', router);
app.use('/pub', publicRouter);


app.listen(3000, () => {
  console.log('live 3000');
});
