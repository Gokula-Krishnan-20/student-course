const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String
}, { collection: 'user' }); // 👈 Force collection name

module.exports = mongoose.model('User', userSchema);
