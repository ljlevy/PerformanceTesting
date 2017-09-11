var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
  name: String,
  description: String,
  localisation: String,
  url: String
});

var TestModel = mongoose.model('tests', testSchema);

exports.schema = testSchema;
exports.model = TestModel;
