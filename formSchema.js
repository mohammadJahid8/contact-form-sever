const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
    name: String,
    email: String,
    emailCode: String,
    messages: String,
    number: String,
    subject: String,
    mobileCode: String,
    verified: Boolean,
})

module.exports = formSchema;