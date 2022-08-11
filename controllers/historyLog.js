const User = require("../models/user")
const HistoryLog = require("../models/historyLog")

exports.getHistoryLog = (async (req, res, next) => {
    try {
      const historyLogList = await HistoryLog.find()
      console.log("historyLogList ", historyLogList)
      res.status(200).json(historyLogList)
    } catch(e){
      console.log(e)
      res.status(500).json({
        message: "There was a problem getting history log data"
      })
    }  
  })

exports.postCreateHistoryLog = (async (req, res, next) => {
    const userId = req.body.userId
    console.log("req.body", req.body)
    const user  = await User.findById(userId)

    const historyInitiator = user.email
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    const historyContent = req.body.historyContent

    try {
        const historyLog = new HistoryLog({
        historyInitiator:historyInitiator,
        timestamp: timestamp,
        historyContent: historyContent
        })

        historyLog.save().then((createdHistoryLog)=>{
        res.status(201).json({
            ...createdHistoryLog
            
        })
        })
    } catch (e) {
        console.log("history log post error :", e)
        res.status(400).json(e)
    }
})

exports.clearHistoryLog = (async (req, res, next) => {
    try {
      await HistoryLog.deleteMany()
      res.status(200).json({message: "History log cleared"})
    } catch(e){
      console.log(e)
      res.status(500).json({
        message: "There was a problem clearing history log data"
      })
    }  
  })