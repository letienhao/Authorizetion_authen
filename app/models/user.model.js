const mongoose = require('mongoose');
const schema = mongoose.Schema
const SchemaUser = new schema({
    username:String,
    email : String,
    password : String,
    roles :[
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Role"
        }
    ]
})
const User = mongoose.model('User',SchemaUser)
module.exports = User