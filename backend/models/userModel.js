import 'dotenv';
import mongoose from 'mongoose';
import validator from 'validator';
import { USER } from '../constants/index.js';

const { Schema } = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[A-Z][A-z0-9-_]{3,23}$/.test(value);
        },
        messsage:
          'username must be alphanumeric without special characters.Hyphens and underscores allowed',
      },
    },
    firstName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        'First name can only have Aplphanumeric values. No special characters allowed',
      ],
    },
    lastName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        'Last  name can only have Aplphanumeric values. No special characters allowed',
      ],
    },

    password: {
      type: String,
      select: false,
      validate: [
        validator.isStrongPassword,
        'Password must be atleast 8 characters long, with at least 1 uppercase and lowercase letters and at least 1 symbol',
      ],
    },
    passwordConfirm: {
      type: String,

      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'Passwords don not match',
      },
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    provider: {
      type: String,
      required: true,
      default: 'email',
    },
    googleID: String,
    avatar: String,
    businessName: String,
    phoneNumber: {
      type: String,
      default: '+256770829425',
      validate: [
        validator.isMobilePhone,
        "Your mobile phone number must begin with a '+', followed by your country code then actual number e.g +256770829425",
      ],
    },
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,

    roles: {
      type: [String],
      default: [USER],
    },
    active: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // If the roles array is empty, add the default USER role before saving the document
  if (this.roles.length === 0) this.roles.push(USER);
  next();
});

userSchema.pre('save', async function (next) {
  /**
   * Only run this function if password was actually modified
   * This function is used to hash the password before saving the document
   * to the database. The passwordConfirm field is removed after hashing
   * the password so that it is not saved to the database.
   */
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  /**
   * If the password has not been modified or if the document is new, then
   * we don't need to update the passwordChangedAt field.
   */
  if (!this.isModified('password') || this.isNew) return next();

  // Update the passwordChangedAt field to the current time minus one second,
  // so that the comparison in the `checkPasswordChangedAfter` method will
  // not return true immediately.
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/**
 * Compares the given password with the hashed password stored in the database.
 * The given password is hashed with the same salt used to hash the password in the database
 * and then the two hashed passwords are compared.
 * @param {string} givenPassword - The password given by the user.
 * @returns {Promise<boolean>} - A promise resolving to true if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function (givenPassword) {
  return await bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
