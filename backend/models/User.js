
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Student' }
});

module.exports = mongoose.model('User', userSchema); // 💡 Rename from 'model' to 'User'