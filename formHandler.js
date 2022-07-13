const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const formSchema = require('./formSchema');
const FormData = mongoose.model('FormData', formSchema);
const OTPVerification = require('./models/OTPVerification');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
// const emailSchema = require('./models/emailSchema');
// const EmailData = mongoose.model('EmailData', emailSchema);




//Nodemailer setup
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
        user: "mohammadjahid0007@gmail.com", // generated ethereal user
        pass: "qhxambsrlqqcdzhi", // generated ethereal password
    },

    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2"
    }
});

//post
router.post('/', async (req, res) => {
    const newData = new FormData(req.body);
    const email = newData.email;
    console.log(email);
    await newData.save((err) => {
        if (err) {
            res.status(500).json({
                error: "There was an error"
            })
        }
        else {
            res.status(200).json({
                error: "Data was inserted successfully"
            });
        }
    });

});

//send the otp
router.post('/emailOtp', async (req, res) => {
    try {
        const newData = req.body;
        console.log(newData);
        const email = newData.email;
        console.log(email);
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const mailOptions = {
            from: '"Mohammad Jahid" <mohammadjahid0007@gmail.com>',
            to: email,
            subject: "Verify your email",
            html: `<p>User <b>${otp}</b> to verify your mail</p>
            <p>This OTP expires in 1hour</p>
            `
        }
        // hash the otp
        // const hashedOTP = await bcrypt.hash(otp, 10);
        const newOTPVerification = await new OTPVerification({
            otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });
        //save otp record
        await newOTPVerification.save();
        transporter.sendMail(mailOptions);
        res.json({
            status: "pending",
            message: "OTP sent to your email",
            data: {
                email,
            }
        })
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
    catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
});

//verify the otp
router.post('/verifyOtp', async (req, res) => {
    try {
        console.log(req.body);
        let { otp } = req.body;
        if (!otp) {
            res.status(400).json({
                status: "Failed",
                message: "OTP is required"
            })
        } else {
            const otpVerification = await OTPVerification.findOne({
                // _id: id,
                otp: otp,
                expiresAt: { $gt: Date.now() }
            });
            console.log(otpVerification);
            if (!otpVerification) {
                res.status(400).json({
                    status: "Failed",
                    message: "OTP is invalid"
                })
            } else {
                const validOTP = (otp == otpVerification.otp); //await bcrypt.compare(otp, otpVerification.otp);
                if (!validOTP && validOTP.length !== 4) {
                    res.status(400).json({
                        status: "Failed",
                        message: "OTP is invalid"
                    })
                } else {
                    res.status(200).json({
                        status: "success",
                        message: "OTP is valid"
                    })
                }
            }
        }
    }
    catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
})





module.exports = router;