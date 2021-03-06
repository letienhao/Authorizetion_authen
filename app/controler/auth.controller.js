// Chúng ta sẽ lần lượt tạo controller cho 2 phần: Authentication và Authorization.

// Controller cho Authentication Với phần này, chúng ta có 2 công việc chính cho tính năng authentication:

// Đăng ký: tạo người dùng mới và lưu trong cơ sở dữ liệu (với role mặc định là User nếu không chỉ định trước lúc đăng ký).
// Đăng nhập: quá trình đăng nhập gồm 4 bước:
// Tìm username trong cơ sở dữ liệu,
// Nếu username tồn tại, so sánh password với password trong CSDL sử dụng. Nếu password khớp, tạo token bằng jsonwebtoken rồi trả về client với thông tin User kèm access-Token Nguyên lý chỉ có như vậy
const config = require('../config/auth.config')
const db = require('../models')
const User = db.user;
const Role = db.role;
var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs');
// exports.singup = (req,res)=>{
//     const {username,email} = req.body
//     const user = new User({
//         username,
//         mail,
//         password : bcrypt.hashSync(req.body.password,8)
//     });
//     user.save((err,user)=>{
//         if(err){
//             res.status(500).send({message: err})
//             return;
//         }
//         if(req.body.roles){
//             Role.find({
//                 name : {$in :req.body.roles}
//             },(err,roles)=>{
//                 if(err){
//                     res.status(500).send({message: err})
//                     return;
//                 }
//                 user.roles = roles.map(role=> role._id);
//                 user.save(err=>{
//                     if(err){
//                         res.status(500).send({message:err});
//                         return;
//                     }
//                   res.send({message: "user was registered success"})
//                 })
//             })
//         }
//         else{
//             Role.findOne({name :"user"},(err,role)=>{
//                 if(err){
//                     res.status(500).send({message : err})
//                     return;
//                 }
//                 user.roles = [role._id];
//                 user.save(err=>{
//                     if(err){
//                         res.status(500).send({message: err})
//                         return;
//                     }
//                 })
//             })
//         }
//     })
// };
exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });
  console.log(user)
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        
        (err,roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

         user.roles = roles.map(role => role._id); 
          console.log(user.roles)
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};
exports.signin = (req, res) => {
     const {username,password} = req.body
     console.log(username)
  User.findOne({
      username
    })
      .populate("roles")
      .exec((err, user) => {
        //console.log(user)
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
        var passwordIsValid = bcrypt.compareSync(
          password,
          user.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
      //   var authorities = [];
      //  // console.log(user.roles)
      //   for (let i = 0; i < user.roles.length; i++) {
      //     //console.log(user.roles[i].name)
      //     authorities.push("ROLE_" + user.roles[i].name);
      //   }
        res.status(200).send({
          // id: user._id,
          // username: user.username,
          // email: user.email,
          // roles: user,
           accessToken: token,
          data: user
        });
      });
  };
  