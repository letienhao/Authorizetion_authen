const mongoose = require('mongoose');
const schema = mongoose.Schema;
const SchemaRole = new schema({
    name : String
})
const Role = mongoose.model('Role',SchemaRole)
module.exports = Role;