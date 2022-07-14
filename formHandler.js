const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const formSchema = require('./formSchema');
const FormData = mongoose.model('FormData', formSchema);
const OTPVerification = require('./models/OTPVerification');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");

const client = require('twilio')("ACe13aa47fce5a4383df4afe15ce2b4011", "52409996651ab115b2502090b3bc0baa");

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


router.post('/mobileOTP', async (req, res) => {
    try {
        const newData = req.body;
        const number = newData.number;
        const otp = `${Math.floor(10000 + Math.random() * 9000)}`;


        const newOTPVerification = await new OTPVerification({
            otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });

        await newOTPVerification.save();

        client.messages.create({
            body: `Your OTP is ${otp}`,
            to: `+88${number}`,
            from: '+13344542504'
        }).then(message => {
            res.json({
                status: "pending",
                message: "OTP sent to your number",
                data: {
                    number,
                }
            })
        })
            // here you can implement your fallback code
            .catch(error => console.log(error))

    } catch (error) {
        console.error("Error: ", error.message);
        return res.status(500).json({ error: error.message })
    }
})

//send the otp
router.post('/emailOtp', async (req, res) => {
    try {
        const newData = req.body;
        const email = newData.email;
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
        const newOTPVerification = await new OTPVerification({
            otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000
        });

        //save otp record
        await newOTPVerification.save();
        let info = await transporter.sendMail(mailOptions);

        res.json({
            status: "pending",
            message: "OTP sent to your email",
            data: {
                email,
            }
        })
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
    catch (err) {
        res.status(500).json({
            status: "Failed",
            message: err.message
        })
    }
});

//post
router.post('/', async (req, res) => {
    try {
        const newData = new FormData(req.body);
        const otp = newData.emailCode;
        const mobileOtp = newData.mobileCode;
        console.log(mobileOtp, otp);
        if (!otp && !mobileOtp) {
            res.status(400).json({
                status: "Failed",
                message: "OTP is required"
            })
        } else {
            const otpVerification = await OTPVerification.findOne({
                otp: otp,
            });

            const mobileOtpVerification = await OTPVerification.findOne({
                otp: mobileOtp,
            });

            console.log(otpVerification, mobileOtpVerification);
            if (!otpVerification && !mobileOtpVerification) {
                res.status(400).json({
                    status: "Failed",
                    message: "OTP is invalid"
                })
            } else {
                const validOTP = (otp == otpVerification.otp) && (mobileOtp == mobileOtpVerification.otp); //await bcrypt.compare(otp, otpVerification.otp);
                if (!validOTP && ((validOTP.length !== 4) || (validOTP.length !== 5))) {
                    res.status(400).json({
                        status: "Failed",
                        message: "OTP is invalid"
                    })
                } else {
                    await newData.save((err) => {
                        if (err) {
                            res.status(500).json({
                                error: "There was an error"
                            })
                        }
                        else {
                            res.status(200).json({
                                message: "Data was inserted successfully"
                            });
                        }
                    });
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
});


module.exports = router;