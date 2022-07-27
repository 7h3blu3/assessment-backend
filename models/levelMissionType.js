const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const levelMissionType = new Schema({
  mission: {
    type: String,
    uppercase: true
  },
  level: {
    type: String,
  },
  type: {
    type: String
  }
})

module.exports = mongoose.model('levelMissionType', levelMissionType);  