var express = require('express');

var router = express.Router();

var scrape = require('../scripts/scrape.js');

var headlinesController = require('../controllers/headlines.js');
var notesController = require('../controllers/notes.js');


router.get('/', function(req, res) {
    res.render('home');
});


router.get('/test', function(req,res) {

    scrape("http://www.nytimes.com", function(data) {
      
        res.json(data);
    });
});


router.post('/fetch', function(req, res) {

    headlinesController.fetch();

    res.send('success');
});

// check the mongodb for data
router.get('/check', function(req, res) {
    
    headlinesController.check(function(data) {
        res.json(data);
    });
});

router.post('/gather', function(req, res) {
   
    notesController.gather(req.body, function(data) {
      
        res.json(data);
    });
});

// post our saved note to the db
router.post('/save', function(req, res) {
    
    notesController.save(req.body, function(data) {
      
        res.json(data);
    });
});

router.delete('/delete', function(req, res) {
    
    notesController.delete(req.body, function(data) {
        // send the removal data to the browser as a json
        res.json(data);
    });
});

module.exports = router;
