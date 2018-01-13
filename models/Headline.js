var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var headlineSchema = new Schema({
  headline: {
    type: String,
    required: true
  },
  summary:{
    type: String,
    required: true
  },
  date: String,
});

var Headline = mongoose.model('Headline', headlineSchema);

module.exports = Headline;