const Scenario = require("../models/scenario")
const User = require("../models/user")


//User Page
exports.getStartAssessment = (async (req, res, next) => {
  try {
    // Will need to use this user when we get session and delete below one
    // const user = await User.findById(req.session.user._id)
    const user  = await User.findById("626be77695ed44839b8079c9")
    console.log("User id ", user._id.toString())
    if(!user) {
      return res.status(404).send()
    }
    res.status(200).json(user)
  } catch (e){
    console.log("Is there an error " + e)
    res.status(500).send(e)
  }   
})

//Assessment page for user.
exports.getAssessment = (async (req, res, next) => {
  
  try {
    //This will be hardcoded before we use the session
    // const user = await User.findById(req.session.user._id)
    const user = await User.findById("626be77695ed44839b8079c9")
    // console.log("Show me the user ", user)
    // console.log(user.assignedType3[0])

    // Gotta figure this out
    // const scenarios = await Scenario.find({level: user.level, mission: user.mission})

    // for (var i = 0; i < user.alreadyAssigned.length; i++) {
    //   console.log("I should be printing all of the ID's " + user.alreadyAssigned[i]);
    //   if(user.alreadyAssigned[i] === scenarios._id){
    //   user.assignedScenarios = []
    //  }
    // }

    // console.log(findDuplicates(strArray)) // All duplicates
    // console.log([...new Set(findDuplicates(strArray))]) // filteredMissions duplicates
    
      //Assign random scenario from type1
      if(user.testCounter === 1){
        
        const docCount = await Scenario.countDocuments({level: user.level,mission: user.mission,type: "Type1"}).exec()
        const rand = Math.floor(Math.random() * docCount)
        const randScenario = await Scenario.findOne({level: user.level,mission: user.mission,type: "Type1"}).skip(rand)
        console.log("Type1", randScenario)
        if(user.assignedScenarios < 1)
          user.testCounter = 2
          await user.save()
          if(user.assignedScenarios < 1) {
            user.assignedScenarios = {scenarioId:randScenario._id.toString()}
            await user.save()
          }
      //Assign random scenario from type2
      } else if(user.testCounter === 2){
        const docCount = await Scenario.countDocuments({level: user.level,mission: user.mission,type: "Type2"}).exec()
        const rand = Math.floor(Math.random() * docCount)
        const randScenario = await Scenario.findOne({level: user.level,mission: user.mission,type: "Type2"}).skip(rand)
        console.log("Type2", randScenario)
        if(user.assignedScenarios < 1)
          user.testCounter = 1             
          await user.save()
          if(user.assignedScenarios < 1) {
            user.assignedScenarios = {scenarioId:randScenario._id.toString()}
            await user.save()
        } 
      //Get random scenario from the assigned to you type3
      } else if(user.testCounter === 3 && user.assignedType3 > 0){
        const randScenario = await Scenario.findOne({_id: user.assignedType3[0].scenarioType3Id})

        if(user.assignedScenarios < 1)
        user.testCounter = 1      
        
        //Find the assigned type3 and remove it
        user.assignedType3.forEach(element => {
          if(randScenario._id.toString() === element.scenarioType3Id){
            user.assignedType3.splice(user.assignedType3.findIndex(function(i){
              return i.randScenario === user.assignedType3;
          }), 1)
          }
        });

        await user.save()
        
        if(user.assignedScenarios < 1) {
        user.assignedScenarios = {scenarioId:randScenario._id.toString()}
        await user.save()
        }
        // else if (user.testCounter === 3 && user.assignedType3 > 0){
        //   user.testCounter = 1 
        // }

      }

    if(!user) {
      return res.status(404).send()
    }
    const scenario = await Scenario.findById(user.assignedScenarios[0].scenarioId)
    // console.log("This is the scenario by id: ", scenario)
    /* current timestamp in milliseconds
     The thingie with the time works perfectly
     Will need to check how to use it with angular tho */
    const currentDate = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') //This formats current date like so: 2021-04-28 15:54:08
    const finishDate = new Date(Date.now() + ( 3600 * 1000 * (scenario.time / 60))).toISOString().replace(/T/, ' ').replace(/\..+/, '')
    console.log(currentDate)
    console.log(finishDate)
    if(finishDate === currentDate)
    {
      console.log('hi')
    } 
    
    res.status(200).json({
      user,
      scenario,
      currentDate: currentDate,
      finishDate: finishDate
    })
 

  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }   
})

exports.postAssessment = (async (req, res, next) => {
  
  //This will be hardcoded before we use the session
  const findUser = await User.findById("626be77695ed44839b8079c9")
  // const findUser = await User.findById(req.session.user._id)
  
  console.log("This is the id ", findUser)
  const userSubmit = req.body
  // This will be requested from the user.session
  const level = req.body.level
  const mission = req.body.mission

  console.log(userSubmit)
  const nowDate = new Date().toUTCString()
  const userSubmitted = [
    {
      scenarioId:userSubmit.scenarioId, 
      userId: findUser._id,
      scenarioDescription:userSubmit.scenarioDescription, 
      scenarioTitle:userSubmit.scenarioTitle, 
      userResponse: userSubmit.userResponse,
      level: userSubmit.level,
      mission: userSubmit.mission,
      scenarioDateTaken:nowDate
    }]
  console.log("Is it the date ", nowDate)
  
  console.log("This is the scenario ", userSubmit)

  

    try{
        
          const user = await User.findByIdAndUpdate(findUser, 
            {
              $push: 
              {
                submittedScenarios: userSubmitted,
                alreadyAssigned: 
                {
                  scenarioId: userSubmit.scenarioId
                }
              }
            },
            {
              new: true, runValidators: true,useFindAndModify: false}
            )
          
          user.assignedScenarios = []

          await user.save()

          if(!user) {
          return res.status(400).send("Greetings")
          // .then((assignedUser)=>{
          //   console.log(assignedUser)
          //   res.status(201).json({
          //     user:{
          //       ...assignedUser
          //     }
          //   })
          // }).catch(error => {
          //   res.status(500).json({
          //       message: "Assigning a scenario failed!"
          //   })
          //   console.log("Assigning scenario error " + error)
          // })
       }
        }
        catch (e) {
          console.log(e)
          res.status(500).json(e)
        }   
})