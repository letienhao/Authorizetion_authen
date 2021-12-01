const { verifySignUp } = require("../middlewares");
const controller = require("../controler/auth.controller");
module.exports =  (app)=>{
  // app.use(function(req, res, next) {
  //   res.header(
  //     "Access-Control-Allow-Headers",
  //     "x-access-token, Origin, Content-Type, Accept"
  //   );
  //   next();
  // });
  app.post("/api/auth/signup",
  [
      verifySignUp.checkDuplicateUserNameOrEmal,
      verifySignUp.checkRoleExisted
    ],
    controller.signup
    
  );
  app.post("/api/auth/signin", controller.signin);
};