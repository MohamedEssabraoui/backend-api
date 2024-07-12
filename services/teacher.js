const userModel = require("../models/user")



var getAllTeacher = (req, res, next) => {
  userModel.find({usertype:"TEACHER"}, (err, users)=>{
    if(err) {
      res.status(500).json({
        success:false,
        message : 'Internal server error'
      })
    } else {
      var teachers = []
      users.forEach((teacher)=>{
        teachers.push({
          "id" : teacher._id,
          "name" : teacher.username,
          "status" : teacher.status,
          "email" : teacher.email,
          "usertype" : teacher.usertype,
          "password" : teacher.password,
        })
      })
      res.json({
        success : true,
        teachers
      })
    }
  })
}
var getTeacher = (req, res, next) => {

   req.check('_id','ID not found').notEmpty();
  var errors = req.validationErrors()
  if(errors){
    console.log(errors);
    res.json({
      success : false,
      message : 'Invalid Inputs',
      errors : errors
    })

  }else { 
    
    userModel.findById({_id:req.body._id})
    .then((result)=>{
      console.log(result)
      if(result) {
        res.json({
          success:true,
          teacher:result
        })
      } else {
        res.json({
          success: false,
          message : 'not found'
        })
      }
    })
    .catch((err)=>{
      console.log(err);
      res.status(500).json({
        success : false,
        message : "error"
      })
    })
   } 
}

var getTeacherStatusCount = (req,res,next) => {
  userModel.aggregate(
    [
      {$match:{usertype:"TEACHER"}},
      {$group: {_id:"$status",count:{$sum:1}} }
    ]
  )
  .then((result)=>{
      var trueCount = 0
      var falseCount = 0
      result.forEach((x)=>{
        if(x._id == true) {
          trueCount = x.count
        }
        if(x._id == false) {
          falseCount = x.count
        }
      })
      res.json({
        success:true,
        active : trueCount,
        blocked : falseCount
      })
    })
    .catch((err)=>{
      console.log(err)
      res.status(500).json({
        success:false,
        message:'Internal server error'
      })
    })
}

module.exports = {
  getTeacherStatusCount,
  getTeacher,
  getAllTeacher
}