var mongoose = require('mongoose');

var testResultSchema = mongoose.Schema({
  value: mongoose.Schema.Types.Mixed,
  test: {type: mongoose.Schema.Types.ObjectId, ref: 'tests'},
  device: {type: mongoose.Schema.Types.ObjectId, ref: 'devices'}
});

var TestResultModel = mongoose.model('testsResults', testResultSchema);

exports.schema = testResultSchema;
exports.model = TestResultModel;