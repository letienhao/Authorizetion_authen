// Để xử lý việc Authentication & Authorization, chúng ta cần tạo các hàm sau:

// Kiểm tra token có hợp lệ hay không? Chúng ta có thể lấy thông tin token trong trường x-access-token của Header HTTP, sau đó chuyển cho hàm verify() xử lý.
// Kiểm tra role đăng ký đã có role chưa hay là trống?
const jwt = require('jsonwebtoken')
const config = require('../config/auth.config');
const db = require('../models')
const User = db.user
const Role = db.role

verifyToken  = (req,res,next)=>{
    let token = req.headers["x-access-token"];
    if(!token){
        return res.status(403).send({
            message: "no token provided"
        })
    }
    jwt.verify(token,config.secret,(err,decode)=>{
        if(err){
            res.status(401).json({
                message : "unauthorized !"
            })
        }
        req.userId = decode.id
      
        next();
    })

}
isAdmin = (req,res,next)=>{
    User.findById(req.userId).exec((err,user)=>{
        if(err){
            res.status(500).send({
                message: err
            })
            return;
        }
        Role.find({
            _id :{$in :user.roles}
        },(err,roles)=>{
            if(err){
                res.status(500).send({
                    message : err
                })
                return;
            }
            for(let i=0;i<=roles.length;i++){
                if(roles[i].name === "admin"){
                    next();
                    return;
                }
            }
            res.status(403).send({
                message : "require admin role"

            })
            return;
        })
    })
};
isModerator = (req,res,next)=>{
    User.findById(req.userId).exec((err,user)=>{
        if(err){
            res.status(500).send({message : err});
            return
        }
        Role.find({
            _id : {$in:user.roles}
        },(err,roles)=>{
            if(err){
                res.status(500).send({message:err})
            }
            for(let i=0 ;i<=roles.length;i++){
                if(roles[i].name === "moderator"){
                    next();
                    return;
                }

            }
            res.status(403).send({message:"require moderator role"})
        })

    })
}
const authJwt = {
    verifyToken,
    isAdmin,
    isModerator
}
module.exports = authJwt