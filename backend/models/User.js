const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
  type: String, 
  required: true, 
  unique: true,
  lowercase: true,
  trim: true,
  match: /^\S+@\S+\.\S+$/,  // simple email regex validation
         },
  password: { type: String, required: true, minlength: 6 },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

// Password hash middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
