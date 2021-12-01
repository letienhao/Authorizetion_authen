const express = require('express');
const bodyparser = require('body-parser');
const app = express();
//const cors = require('cors');
const env = require('dotenv').config();
const PORT = process.env.PORT  || 8080
//app.use(cors(corsOptions));
//parse request of conntent-type-applicaton/json
app.use(bodyparser.json());
//parse request of content-type -application/x-www-form-urlencode
app.use(bodyparser.urlencoded({extended:true}))
//connect db
const db = require('./app/models');
const dbConfig = require('./app/config/db.config');
const Role = db.role

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`,{useNewUrlParser: true,
useUnifiedTopology: true})
.then(()=>{

    console.log('connect successfully mongodb');
    initial();
}).catch(err=>{
   console.log("connect error",err)
   process.exit()
})
function initial(){
    Role.estimatedDocumentCount((err,count)=>{
        if(!err && count === 0){
            new Role({
                name : "user"
            }).save(err=>{
                if(err){
                    cosole.log("error",err);
                }
                console.log("added 'user' to roles collection")
            }
            )
            new Role({
                name : "admin"
            }).save(err=>{
                if(err){
                    console.log("error admin",err)
                }
                console.log("added 'admin' to roles collection")
            });
            new Role({
                name : "moderator"
            }).save(err=>{
                if(err){
                    console.log('error',err)
                }
                console.log("added 'moderator' to roles collection");
            })
        };
    })
 
}
//route
app.get("/",(req,res)=>{
    res.json({message: "chào mừng đến application"});
}) 
// routes
require('./app/routers/auth.routers')(app);
require('./app/routers/user.routers')(app);
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})