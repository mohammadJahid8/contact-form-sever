const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const formSchema = require('./formSchema');
const FormData = mongoose.model('FormData', formSchema);

//post
router.post('/', async (req, res) => {
    const newData = new FormData(req.body);
    console.log(newData);
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


module.exports = router;