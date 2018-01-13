var scrape = require('../scripts/scrape.js');
var makeDate = require('../scripts/date.js');

var Headline = require('../models/Headline');
var Note = require('../models/Note');


exports.fetch = function() {

 
  scrape("http://www.nytimes.com", function(data) {
    
    var obj = data;

    var formattedDate = makeDate();

    for (var i in obj) {
      addIfNotFound(i);
    }

    
    function addIfNotFound(current) {
      Headline.findOne({
        'headline': obj[current][0]
      }, function(err, res) {
        // log any errors
        if (err) {
          console.log(err);
        }
        if (res === null) {
          var headlineEntry = new Headline({
            headline: obj[current][0],
            summary: obj[current][1],
            date: formattedDate
          });
          headlineEntry.save(function(err) {
            if (err) {
              console.log(err);
            } 
            else {
              console.log('successfully added');
            }
          });
        }
      });
    }

  });
};

exports.check = function(cb) {
  Headline.find()
    .sort({
      _id: -1
    })
    .exec(function(err, doc) {
      cb(doc);
    });
};
