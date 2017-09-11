var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
  middleware: String,
  middlewareVersion: String,
  model: String,
  macAddress: String
});

var Device = mongoose.model('devices', deviceSchema);

exports.schema = deviceSchema;
exports.model = Device;