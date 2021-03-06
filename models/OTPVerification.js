const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OTPVerificationSchema = new Schema({
    otp: String,
    createdAt: Date,
    expiresAt: Date,
})

const OTPVerification = mongoose.model(
    'OTPVerification',
    OTPVerificationSchema
);

module.exports = OTPVerification;