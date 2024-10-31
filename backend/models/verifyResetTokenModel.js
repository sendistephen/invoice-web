import mongoose from 'mongoose';

const { Schema } = mongoose;

const verifyResetTokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // Reference to the User model
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 900, // This field will automatically delete the document after 900 seconds (15 minutes)
  },
});

// Create a model using the schema
const VerifyResetToken = mongoose.model(
  'VerifyResetToken',
  verifyResetTokenSchema
);

export default VerifyResetToken;
