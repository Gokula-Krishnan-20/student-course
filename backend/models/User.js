/* const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, enum: ['Principal', 'Instructor', 'Student'] },
});

module.exports = mongoose.model('User', userSchema);
 */

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Student'], default: 'Student' }
});

module.exports = mongoose.model('User', userSchema); // 💡 Rename from 'model' to 'User'
