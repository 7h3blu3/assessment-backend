// function adminRole (userType) {
//     return (req, res, next) => {
//      if (req.user.userType === "User" && req.user.assignedScenarios.length === 1) {
//         res.status(401)
//         return res.redirect("../assessment");
//     } else if (req.user.userType === "Reviewer") {
//         res.status(401)
//         return res.redirect("user-submission")
//     } else if (req.user.userType === "Content Manager") {
//         res.status(401)
//         return res.redirect("list-scenarios")
//     }  else if (req.user.userType === "User") {
//         res.status(401)
//         return res.redirect("../start-assessment")
//     }
//     next()
//     }
// }

// function userRole (userType) {
//     return (req, res, next) => {
//      if (req.user.userType === "Admin" || req.user.userType === "Content Manager") {
//         res.status(401)
//         return res.redirect("admin/list-scenarios")
//      } else if (req.user.userType === "Reviewer") {
//         res.status(401)
//         return res.redirect("user-submission")
//     }
//     next()
//     }
// }

// function contentManagerRole (userType) {
//     return (req, res, next) => {
//         if (req.user.userType === "User" && req.user.assignedScenarios.length === 1) {
//             res.status(401)
//             return res.redirect("../assessment");
//         } else if (req.user.userType === "Reviewer") {
//         res.status(401)
//         return res.redirect("user-submission")
//         } else if (req.user.userType === "User") {
//             res.status(401)
//             return res.redirect("../start-assessment")
//         }
//     next()
//     }
// }

// function reviewerRole (userType) {
//     return (req, res, next) => {
//     if (req.user.userType === "User" && req.user.assignedScenarios.length === 1) {
//         res.status(401)
//         return res.redirect("../assessment");
//     } else if (req.user.userType === "Content Manager") {
//         res.status(401)
//         return res.redirect("list-scenarios")
//     } else if (req.user.userType === "User") {
//         res.status(401)
//         return res.redirect("../start-assessment")
//     }
//     next()
//     }
// }

// function alreadyLogged (userType)  {
//             return (req, res, next) => {
//             if(req.session.isLoggedIn) {
//             if (req.user.userType === "User" && req.user.assignedScenarios.length === 1) {
//                 res.status(401)
//                 return res.redirect("../assessment")
//             } else if (req.user.userType === "Reviewer") {
//                 res.status(401)
//                 return res.redirect("admin/user-submission")
//             } else if (req.user.userType === "Content Manager") {
//                 res.status(401)
//                 return res.redirect("admin/list-scenarios")
//             } else if (req.user.userType === "Admin") {
//                 res.status(401)
//                 return res.redirect("admin/list-scenarios")
//             } else if (req.user.userType === "User") {
//                 res.status(401)
//                 return res.redirect("../start-assessment")
//             }
//         }
//     next()
//     }
// }
// module.exports = { adminRole, userRole, reviewerRole, contentManagerRole, alreadyLogged }