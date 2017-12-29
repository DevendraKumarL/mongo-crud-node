const express = require('express'),
	router = express.Router({mergeParams: true}),
	ObjectID = require('mongodb').ObjectID,
	MongoClient = require('mongodb').MongoClient;

var	PERSON_COLLECTION = 'person',
	db,
	DBNAME = 'mongonode';

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
	if (err) return console.log(err);
	db = client.db(DBNAME);
	console.log('connected to mongodb: ' + DBNAME + ' database');
});

function notConnectedToDBResponse(response) {
	response.status(500).json({error: 'Not connected to DB'});
}

// router middleware to check mongo db connection
router.use((req, res, next) => {
	if (!db) {
		notConnectedToDBResponse(res);
	} else {
		next();
	}
});

router.get('/', (req, res) => {
	db.collection(PERSON_COLLECTION).find().toArray((err, results) => {
		if (err) res.status(500).json({error: 'something blew up'});
		res.render('index', {data: results});
	});
});

router.get('/people', (req, res) => {
	db.collection(PERSON_COLLECTION).find().toArray((err, results) => {
		if (err) res.status(500).json({error: 'something blew up'});
		res.json(results);
	});
});

router.get('/person/:id', (req, res) => {
	var queryParam = {'_id': ObjectID(req.params['id'])};
	db.collection(PERSON_COLLECTION).findOne(queryParam, (err, result) => {
		if (err) res.status(500).json({error: 'something blew up'});
		res.json(result);
	});
});

router.post('/person', (req, res) => {
	db.collection(PERSON_COLLECTION).save(req.body, (err, result) => {
		if (err) res.status(500).json({error: err});
		res.json({success: 'new data created', result: result});
	});
});

router.post('/people', (req, res) => {
	db.collection(PERSON_COLLECTION).insertMany(req.body, (err, result) => {
		if (err) res.status(500).json({error: err});
		res.json({success: 'all new data created', result: result});
	});
});

router.put('/person/:id', (req, res) => {
	var queryParam = {'_id': ObjectID(req.params['id'])};
	var data = {$set: req.body};
	db.collection(PERSON_COLLECTION).updateOne(queryParam, data, (err, results) => {
		if (err) res.status(500).json({error: 'something blew up'});
		if (results.result['n'] == 1) res.json({success: 'data updated', result: results.result});
		else res.json({message: 'nothing updated', result: results.result});
	});
});

router.delete('/person/:id', (req, res) => {
	var queryParam = {'_id': ObjectID(req.params['id'])};
	db.collection(PERSON_COLLECTION).removeOne(queryParam, (err, results) => {
		if (err) res.status(500).json({error: 'something blew up'});
		if (results.result['n'] == 1) res.json({success: 'data removed', result: results.result});
		else res.json({message: 'nothing removed', result: results.result});
	});
});

module.exports = router;
