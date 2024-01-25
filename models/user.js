const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  last_name: { type: String, required: true, maxLength: 100 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  membership_status: { type: Boolean, required: true, default: false },
  admin: { type: Boolean, required: true, default: false },
});

// Virtual for user's full name
UserSchema.virtual("name").get(function () {
  // To avoid errors in cases where an user does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.last_name) {
    fullname = `${this.last_name}, ${this.first_name}`;
  }

  return fullname;
});

UserSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Export model
module.exports = mongoose.model("User", UserSchema);
