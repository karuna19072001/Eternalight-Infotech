const mongoose = require('mongoose')

const User = new mongoose.Schema({
 name : {
    type : String
 },
 email : {
    type : String
 },
 password : {
    type : String
 },
 isDelete : {
   type : Boolean,
   default : false
 }
}, { timestamps: true})

module.exports = mongoose.model('User', User)