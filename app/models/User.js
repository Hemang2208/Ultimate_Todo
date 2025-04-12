import process from "process";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required to Enter"],
      minlength: [2, "Name Must be at least 2 Characters Long"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is Required to Enter"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required to Enter"],
      minlength: [7, "Password Must be at Least 7 Characters Long"],
    },
    phone: {
      type: String,
      required: [true, "Phone Number is Required to Enter"],
      minlength: [10, "Phone Number must be exactly 10 digits long"],
      trim: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    pincode: {
      type: String,
      required: false,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      default: "Male",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
