const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const scenarioSchema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    ref: "Scenario",
    required: true
  },
  mission: {
    type: String,
    required:true,
    uppercase: true
  },
  level: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  title: {
    type: String,
    required:true
  },
  description: {
    type:String,
    required:true
  },
  passingGrade: {
    type: Number
  },
  time: {
    type: Number
  },
  logsUrl: {
    type: String,
  },
  scoreCard: {
      question: String,
      weight: Number,
      question2: String,
      weight2: Number,
      question3: String,
      weight3: Number,
      question4: String,
      weight4: Number,
      question5: String,
      weight5: Number,
  },
   // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
})

module.exports = mongoose.model('ScenarioBackup', scenarioSchema)