const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const historyLog = new Schema({
  historyInitiator: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  historyContent: {
    type: String
  }
})

module.exports = mongoose.model('historyLog', historyLog);  