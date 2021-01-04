const mongoose = require('mongoos')
const Schema = mongoose.Schema

const userSchema = Schema({
  username: {type: String, unique: true, required: true},
  password: String,
})

const User = mongoose.model('User', userSchema)

model.exports = User
