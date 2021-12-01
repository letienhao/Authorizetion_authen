const db = require('../models');
const ROLES = db.ROLES
const User = db.user
//Kiểm tra xem tên người dùng, email có bị trùng lặp trong DB hay không?
// Kiểm tra xem role đăng ký có hợp lệ hay không? middlewares/verifySignUp.js
checkDuplicateUserNameOrEmal = (req,res,next)=>{
    const {username,email} = req.body
    User.findOne({username}).exec((err,user)=>{
        if(err){
            res.status(500).send({message : err})
            return;
        }
        if(user){
            res.status(400).send({message : "fail , username is already in use"})
            return;
        }
     User.findOne({email}).exec((err,mail)=>{
        if(err){
            res.status(500).json({message: "fdafds",err});
            return;
          }
       if(mail){
                res.status(500).json({message:"fail, Mail is already in use "})
                return;
            }
            next();
        })
    })
}
checkRoleExisted = (req,res,next)=>{
    if(req.body.roles){
        console.log(req.body.roles);
        for(let i = 0;i < req.body.roles.length;i++){
            if(!ROLES.includes(req.body.roles[i])){   //check xem nếu như role này không tồn tại trong ROLES thì trả về true                                                  
               res.status(400).json({
                   message : `failed role ${req.body.roles[i]} do not exist`
               });
               return;
            }
        }
    }
    next()
};
const verifySignUp = {
    checkDuplicateUserNameOrEmal,
    checkRoleExisted
}
module.exports = verifySignUp