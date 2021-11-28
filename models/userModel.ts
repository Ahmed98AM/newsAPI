import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

interface UserInput {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
  id: string;
}

const userSchema: Schema = new Schema<UserInput, Model<UserInput>, UserInput>({
  name: {
    type: String,
    required: [true, "please tell us your name !"],
  },
  email: {
    type: String,
    require: [true, "please provide your email !"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "please provide a password !"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "please confirm your password !"],
    validate: {
      validator: function (this: UserInput, confirmPass: string) {
        return this.password === confirmPass;
      },
      message: "the password doesn't match !",
    },
  },
  id: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;
