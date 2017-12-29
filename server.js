const express = require('express'),
	MongoClient = require('mongodb').MongoClient,
	jsonBodyParser = require('body-parser').json,
	crudRoutes = require('./routes/crud');

var app = express();

app.set('port', process.env.PORT || 5002);
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(jsonBodyParser());

app.use('/', crudRoutes);

app.listen(app.get('port'), () => {
	console.log('mongodb-node app running on port: ', app.get('port'));
});
