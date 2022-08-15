const Scenario = require("../models/scenario")
const scenarioBackup = require("../models/scenarioBackup")
const nodemailer = require('nodemailer')
const User = require("../models/user")
const userBackup = require("../models/userBackup")
const levelMissionType = require("../models/levelMissionType")

const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "6e10fe391f6bd2",
    pass: "4745b00e704e6a"
  }
})

exports.getPanel = (async (req, res, next) => {
      const scenario = await Scenario.find()
      const allMissions = []
      scenario.forEach(element => allMissions.push(element.mission))
      const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
      filteredMissions.forEach(element => console.log(element))

  try {
    res.render("admin/panel", {
      pageTitle: "Admin Panel",
      path: "/admin/panel",
      filteredMissions
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

// exports.postPanel = (async (req, res, next) => {
//   const mission = req.body.mission

//     try {
//       const scenario = new Scenario({
//         mission: mission
//       })

//       console.log(scenario)
//       } catch(e){
//       console.log(e)
//       res.status(500).send(e)
//       }  
//     })

exports.getListUsers = (async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch(e){
    console.log(e)
    res.status(500).json({
      message: "Create scenario render failed"
    })
  }  
})

exports.getListArchivedUsers = (async (req, res, next) => {
  try {
    const usersBackup = await userBackup.find()

    res.status(200).json(usersBackup)
  } catch(e){
    console.log(e)
    res.status(500).json({
      error: e
    })
  }  
})


exports.getEditUsers = (async (req, res, next) => {
  const scenario = await Scenario.find()

  const userId = req.params.userId
 
  const allMissions = []
  scenario.forEach(element => allMissions.push(element.mission))
  const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
  filteredMissions.forEach(element => console.log(element))

  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.redirect('/admin/panel')
    }
    res.render('admin/edit-users', {
      pageTitle: 'Edit Users',
      path: '/admin/edit-users',
      user: user,
      filteredMissions
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postEditUsers = (async (req, res, next) => {
  const userId = req.body.userId
  const updatedType = req.body.userType
  const updatedLevel = req.body.level
  const updatedMission = req.body.mission

 
  try {
    const user = await User.findById(userId)
    user.userType = updatedType
    user.level = updatedLevel
    user.mission = updatedMission
    user.save().then((assignedUser)=>{
      console.log(assignedUser)
      res.status(201).json(user)
    }).catch(error => {
      res.status(500).json({
          message: "Assigning a scenario failed!"
      })
      console.log("Assigning scenario error " + error)
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postArchivedUsers = (async (req, res, next) => {
  const userId = req.params.id
  console.log("The user id is " + userId)
  try {
    const user = await User.findById(userId)

    const usersBackup = new userBackup({
      email: user.email,
      password: user.password,
      userType: user.userType,
      mission: user.mission,
      level: user.level,
      assignedScenarios: user.assignedScenarios,
      submittedScenarios: user.submittedScenarios,
      finalGrade: user.finalGrade,
      alreadyAssigned: user.alreadyAssigned,
      assignedType3: user.assignedType3,
      testCounter: user.testCounter,
      time: user.time,
      _id: user._id,
      userId: req.user,
    })

    await usersBackup.save()
    await User.findByIdAndDelete(userId)
    console.log('User archived!')

    res.status(200).json(usersBackup)
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.deleteUser = (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);
  userBackup.deleteOne({ _id: userId }).then((result) => {
      if (result.deletedCount > 0){
          res.status(200).json({ message: "User deleted!" })
          console.log("User deleted!");
      } else {
          res.status(401).json({ message: "Not authorized to delete!" })
          console.log("Not authorized to delete!");
      }
  }).catch(error => {
      res.status(500).json({
          message: "Deleting a user has failed!"
      })
      console.log("delete error " + error)
  });
}

exports.deleteScenario = (req, res, next) => {
  const scenarioId = req.params.scenarioId;
  console.log(scenarioId);
  scenarioBackup.deleteOne({ _id: scenarioId }).then((result) => {
      if (result.deletedCount > 0){
          res.status(200).json({ message: "Scenario deleted!" })
          console.log("Scenario deleted!");
      } else {
          res.status(401).json({ message: "Not authorized to delete!" })
          console.log("Not authorized to delete!");
      }
  }).catch(error => {
      res.status(500).json({
          message: "Deleting a scenario has failed!"
      })
      console.log("delete error " + error)
  });
}

exports.postRestoreUsers = (async (req, res, next) => {
  const userBackupId = req.params.id
  try {
    const userBckp = await userBackup.findById(userBackupId)
    const user = new User({

      email: userBckp.email,
      password: userBckp.password,
      userType: userBckp.userType,
      mission: userBckp.mission,
      level: userBckp.level,
      assignedScenarios: userBckp.assignedScenarios,
      submittedScenarios: userBckp.submittedScenarios,
      finalGrade: userBckp.finalGrade,
      alreadyAssigned: userBckp.alreadyAssigned,
      assignedType3: userBckp.assignedType3,
      testCounter: userBckp.testCounter,
      time: userBckp.time,
      _id: userBckp._id,
      userId: req.user,
    })

    await user.save()
    await userBackup.findByIdAndDelete(userBackupId)
    console.log('User Restored!')
    res.status(200).json(user)
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postDeleteUser = (async (req, res, next) => {
  const userBackupId = req.body.userBackupId
  try {
    await userBackup.findByIdAndDelete(userBackupId)
    console.log('User deleted');
      res.redirect('/admin/archived-users')
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }
})

// NOTE!!! - edit-scenarios.ejs page is used for create and EDIT scenarios 
exports.getcreateScenarios = (async (req, res, next) => {

  try {
    const scenario = await Scenario.find()
    
    const allMissions = []
    scenario.forEach(element => allMissions.push(element.mission))
    const filteredMissions = allMissions.filter((item, i, ar) => ar.indexOf(item) === i)
    filteredMissions.forEach(element => console.log(element))

    res.status(200).json(filteredMissions)
  } catch(e){
    console.log("Create scenario render failed" + e)
    res.status(500).json({
      message: "Create scenario render failed"
    })
  }  
})

exports.getListScenarios = (async (req, res, next) => {
  try{
    const scenarios = await Scenario.find()
    res.status(200).json({
      message: "Scenarios Fetched",
      pageTitle: 'List Scenarios',
      scenarios: scenarios
    })
  } catch(e){
    console.log("There is an error with listing scenarios " + e)
    res.status(500).send(e)
  }  
})

exports.getScenario = (async (req, res, next) => {
  const scenarioId = req.params.scenarioId
  try{
    const scenario = await Scenario.findById(scenarioId)
    console.log(scenario)
    res.status(200).json(scenario)
  } catch(e){
    console.log("There is an error with finding this scenario " + e)
    res.status(500).send(e)
  }  
})

exports.getListArchivedScenarios = (async (req, res, next) => {
  try{
    const scenariosBackup = await scenarioBackup.find()
      
    res.status(200).json(scenariosBackup)

  } catch(e){
    console.log("Archiving user failed" + e)
    res.status(500).json({
      message: "Archiving user failed"
    })
  }  
})


exports.getAssignScenarios = (async (req, res, next) => {
  try{
      const user = await User.find({})   
      const scenarioFindType3 = await Scenario.find({type: "Type3"})
      // console.log("Log this ", scenarioFindType3)
      res.status(200).json({
        user: user,
        type3: scenarioFindType3
      })
    } catch(e){
      res.status(500).json({
        message: "Assigning scenario failed"
      })
    }  
})

exports.getLevelMissionType = (async (req, res, next) => {
  try{
      const findLevelMissionType = await levelMissionType.find()   

      console.log("findLevelMissionType " , findLevelMissionType)
      res.status(200).json(findLevelMissionType)
    } catch(e){
      res.status(500).json({
        message: "get findLevelMissionType failed"
      })
    }  
})

exports.postLevelMissionType = (async (req, res, next) => {
  const mission = req.body.mission
  const level = req.body.level
  const type = req.body.type

  try {

    var storeLevelMissionType = new levelMissionType({
    mission: mission,
    level:level,
    type:type
    })

    await storeLevelMissionType.save().then((findLevelMissionType)=>{
      console.log(findLevelMissionType)
      res.status(201).json(findLevelMissionType)
    }).catch(error => {
      res.status(500).json({
          message: "Posting findLevelMissionType failed"
      })
      console.log("Posting findLevelMissionType " + error)
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})


exports.postAssignScenario = (async (req, res, next) => {
  const email = req.body.user
  const scenarioType3Id = req.body.scenarioId
 
  console.log("This is the mail ", email)
  console.log("This is the id ", scenarioType3Id)

  try {
    const findUser = await User.findOne({email: email})

    for (let i = 0; i < findUser.assignedType3.length; i++) {
      let current = findUser.assignedType3[i];
      if (current.scenarioType3Id === scenarioType3Id){
        res.status(400).send(`Scenario ${scenarioType3Id} already assigned to this user`);
        return;
      }
    }

    // delcarative solution:
    // const existingScenario = findUser.assignedType3.find(scenarioData => scenarioData.scenarioType3Id === scenarioType3Id);
    // if (existingScenario) {
    //   res.status(400).send(`Scenario ${scenarioType3Id} already assigned to this user`);
    //   return;
    // }


    for (let i = 0; i < findUser.assignedType3.length; i++) {
      let current = findUser.assignedType3[i];
      if (current.scenarioType3Id === scenarioType3Id){
        const done = true;
      } else {
        
      }
      if (done) {

      }
    }


    await User.findByIdAndUpdate(findUser.id, {$push: {assignedType3: {scenarioType3Id}}}, {new: true, runValidators: true, useFindAndModify:false})
    .then((assignedUser)=>{
      console.log(assignedUser)
      res.status(201).json(assignedUser)
    }).catch(error => {
      res.status(500).json({
          message: "Assigning a scenario failed!"
      })
      console.log("Assigning scenario error " + error)
    })
    
  } catch (e) {
    console.log(e)
    res.status(400).send(e + "CATCH ERROR")
  }
})

exports.postDeleteScenario = (async (req, res, next) => {
  const scenarioBackupId = req.body.scenarioBackupId
  console.log(scenarioBackupId)
  try {
    await scenarioBackup.findByIdAndDelete(scenarioBackupId)
    console.log('Scenario Deleted!')
    res.redirect('/admin/archived-scenarios')
  } catch (e) {
  console.log(e)
  res.status(400).send(e)
  }
})

exports.postRestoreScenario = (async (req, res, next) => {
  const scenarioBackupId = req.params.id
  console.log("What the id ", scenarioBackupId)
  try {
    const scenarioBckp = await scenarioBackup.findById(scenarioBackupId)
    const scenario = new Scenario ({
      _id: scenarioBckp._id,
      mission: scenarioBckp.mission,
      level: scenarioBckp.level,
      type: scenarioBckp.type,
      title: scenarioBckp.title,
      description: scenarioBckp.description,
      passingGrade: scenarioBckp.passingGrade,
      time: scenarioBckp.time,
      logsUrl: scenarioBckp.logsUrl,
      scoreCard: scenarioBckp.scoreCard,
      // userId: req.user,
    })
    await scenario.save().then((restoredScenario)=>{
      res.status(201).json({
        scenario:{
          ...restoredScenario
        }
      })
    }).catch(error => {
      res.status(500).json({
          message: "Restoring a scenario failed!"
      })
      console.log("Restore scenario error " + error)
    })
    await scenarioBackup.findByIdAndDelete(scenarioBackupId)
  } catch (e) {
  console.log(e)
  res.status(400).send(e)
  }
})

exports.postArchiveScenario = (async (req, res, next) => {
  const scenarioId = req.params.id

  try{
    const scenario = await Scenario.findById(scenarioId)

    const scenariosBackup = new scenarioBackup({
      // backupscenario: scenario
      _id: scenario._id,
      mission: scenario.mission,
      level: scenario.level,
      type: scenario.type,
      title: scenario.title,
      description: scenario.description,
      passingGrade: scenario.passingGrade,
      time: scenario.time,
      logsUrl: scenario.logsUrl,
      scoreCard: scenario.scoreCard,
      // userId: req.user,
    })
    
    const result = await scenariosBackup.save()
    Scenario.findByIdAndDelete(scenarioId).then((archivedScenario)=>{
      res.status(201).json(archivedScenario)
  }).catch(error => {
    res.status(500).json({
        message: "Archiving a scenario failed!"
    })
    console.log("Archive scenario error " + error)
  })
    console.log(result)
    console.log('Scenario archived!')
  } catch (e) {
    res.status(500).json({
      message: "Archiving a scenario failed!"
  })
  console.log("Archive scenario error " + e)
  }
})

exports.postCloneScenario = (async (req, res, next) => {
  const scenarioId = req.params.scenarioId
  console.log("scenarioId ", scenarioId)
  try{
    const scenario = await Scenario.findById(scenarioId)

    const scenarioClone = new Scenario({
      mission: scenario.mission,
      level: scenario.level,
      type: scenario.type,
      title: scenario.title,
      description: scenario.description,
      passingGrade: scenario.passingGrade,
      time: scenario.time,
      logsUrl: scenario.logsUrl,
      scoreCard: scenario.scoreCard,
    })
    
  console.log("scenarioClone ", scenarioClone)

    const result = await scenarioClone.save()
    res.status(200).json(result)
  } catch (e) {
    console.log(e)
    res.status(400).json(e)
  }
})

exports.postcreateScenario = (async (req, res, next) => {

  const mission = req.body.mission
  const level = req.body.level
  const type = req.body.type
  const title = req.body.title
  const description = req.body.description
  const passingGrade = req.body.passingGrade
  const time = req.body.time
  const logsUrl = req.body.logsUrl
  const scoreCard = req.body.scoreCard
  const grandTotal = req.body.grandTotal
  
  try {
    const scenario = new Scenario({
      mission: mission,
      level: level,
      type: type,
      title: title,
      description: description,
      passingGrade: passingGrade,
      time:time,
      logsUrl: logsUrl,
      scoreCard:scoreCard,
      grandTotal: grandTotal
      // userId: req.user,
    })
    scenario.save().then((createdScenario)=>{
      res.status(201).json(createdScenario)
    }).catch(error => {
      res.status(500).json({
          message: "Creating a scenario failed!"
      })
      console.log("create post error " + error)
  })
    console.log("This is the angular saved scenario ", scenario)
  } catch (e) {
    console.log(e)
    res.status(400).json(e)
  }
})

// exports.postcreateScenario = (async (req, res, next) => {

//   const title = req.body.title
//   const equalTo100 = req.body.grand_total
//   const description = req.body.description
//   const mission = req.body.mission
//   const level = req.body.level
//   const type = req.body.type
//   const grade = req.body.grade
//   const time = req.body.time
//   // const question = req.body.key
//   // const weight = req.body.value
//   // const scoreCard = [question,weight]
//   const scoreCard = req.body.key
//   var chunk = []
//   scoreCard, chunk
//   var total = []

//   while (scoreCard.length > 0) {

//     chunk = scoreCard.splice(0,2)
//     total.push(chunk)
//     console.log(chunk)

//   }
//   console.log('----')
//   console.log(total)

  
//   try {
//     const scenario = new Scenario({
//       mission: mission,
//       level: level,
//       title: title,
//       type: type,
//       description: description,
//       userId: req.user,
//       time:time,
//       passingGrade: grade,
//       scoreCard: total
//     })
//     while (true)
//       {
//         if(equalTo100 === "100") {
//           scenario.save()
//           console.log('Created Scenario')
//           res.redirect('/admin/list-scenarios')
//           break;    
//         }
//         else {
//           console.log("We need a 100")
//           break;
//       }
//     }
//   } catch (e) {
//     console.log(e)
//     res.status(400).send(e)
//   }
// })

exports.postEditScenario = (async (req, res, next) => {
  const scnId = req.body.scenarioId;
  const updatedMission = req.body.mission
  const updatedLevel = req.body.level
  const updatedType = req.body.type
  const updatedTitle = req.body.title
  const updatedDesc = req.body.description
  const updatedGrade = req.body.passingGrade
  const updatedTime = req.body.time
  const updatedLogsUrl = req.body.logsUrl
  const updatedScoreCard = req.body.scoreCard
  const updatedGrandTotal = req.body.grandTotal

  console.log("The updated logs ", updatedLogsUrl)

  try {
    const scenario = await Scenario.findById(scnId)
    scenario.title = updatedTitle
    scenario.description = updatedDesc
    scenario.mission = updatedMission
    scenario.level = updatedLevel
    scenario.type = updatedType
    scenario.grade = updatedGrade
    scenario.time = updatedTime
    scenario.logsUrl = updatedLogsUrl
    scenario.scoreCard = updatedScoreCard
    scenario.grandTotal = updatedGrandTotal
    scenario.save().then((updatedScenario)=>{
      res.status(201).json(updatedScenario)
    }).catch(error => {
      res.status(500).json({
          message: "Updating scenario failed!"
      })
      console.log("create post error " + error)
  })
    console.log("This is the angular updated scenario ", scenario)
  } catch (e) {
    console.log(e)
    res.status(400).send(e)
  }
})

exports.getUserSubmission = (async (req, res, next) => {
  try{
    const user = await User.find({})
    // const reviewerId = await req.session.user._id
    // const reviewer = await User.findById(reviewerId)
    const currentUserId = req.userData.userId
    const currentUser = await User.findById(currentUserId)
    
    res.status(200).json({
        user: user,
        currentUser: currentUser
      })
    } catch(e){
      console.log(e)
      res.status(500).json({
        message: "Assigning scenario failed"
      })
    }  
})

exports.getSubmissionGrade = (async (req, res, next) => {
  try{
      
      const userId = await req.params.userId
      const scenarioId = req.params.scenarioId

      const user = await User.findById(userId.toString())
      const scenario = await Scenario.findById(scenarioId)
      // var userInput = "1"

    res.status(200).json({
      user:user,
      scenario: scenario,
      // userInput
    })
  } catch(e){
    console.log(e)
    res.status(500).send(e)
  }  
})

exports.postSubmissionGrade = (async (req, res, next) => {
const userId = req.params.userId
const scenId = req.params.scenarioId

const scenarioDescription = req.body.scenarioDescription
const userResponse = req.body.userResponse
const scenarioTitle = req.body.scenarioTitle
const scenarioMission = req.body.scenarioMission
const scenarioLevel = req.body.scenarioLevel
const passingGrade = req.body.passingGrade
const status = req.body.status
const currentGrade = req.body.currentGrade
const feedback = req.body.feedback

try {

  finalGradeData = [{   
    scenarioId: scenId,
    scenarioDescription: scenarioDescription,
    userResponse: userResponse,
    scenarioTitle: scenarioTitle,
    scenarioMission: scenarioMission,
    scenarioLevel: scenarioLevel,
    passingGrade: passingGrade,
    status: status,
    currentGrade: currentGrade,
    feedback: feedback
  }]

  const user = await User.findByIdAndUpdate(userId, {$push: {finalGrade: finalGradeData}}, {new: true, runValidators: true, useFindAndModify:false})

  transporter.sendMail({
    to: user.email,
    from: 'bg@ibm.com',
    subject: 'Grade Completed!',
    html: '<h1>Your work has been graded. Please review!</h1>'
  })

  user.save().then((gradedUser)=>{
    res.status(201).json(gradedUser)
  }).catch(error => {
    res.status(500).json({
        message: "Grading a user failed!"
    })
    console.log("Grading post error " + error)
})
  } catch (e) {
    console.log(e)
    res.status(400).send(e + "CATCH ERROR")
  }
})