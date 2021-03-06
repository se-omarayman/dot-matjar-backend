const express = require('express');
const router = express.Router();
const db = require('../database');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors')
var bcrypt = require('bcryptjs');

router.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
        next();
    } else {
        bodyParser.json()(req, res, next);
    }
});

router.use(cors());



const token = crypto.randomBytes(20).toString('hex');
var hashLink = 'http://localhost:8080/updateForgottenPassword/' + token;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'miroayman6198@gmail.com',
        pass: 'eshta123'
    }
});

router.post('/api/resetpassword', (req, res) => {
    if (!req.body.email ) {
        return res.send('please enter your email')
    }
    db.users.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user == null) {
            return res.send('wrong email')
        };
       

        user.update({
            password_reset_token: hashLink
        })
        return res.status(200).send('authentication succesfull');

    });

});

router.post('/api/sendResetPassword', (req, res) => {

    var mailOptions = {
        from: 'miroayman6198@gmail.com',
        to: req.body.email,
        subject: 'password reset email',
        text: 'click on the link to reset password ' + hashLink
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.send(hashLink)
});

router.post('/api/sendResetPassword/:token', (req, res) => {
    db.users.findOne({
        where: {
            password_reset_token: 'http://localhost:8080/updateForgottenPassword/' + req.params.token
        }
    }).then(user => {
        if (!user) {
            return res.send('user not found with this hash')
        }
        if (!req.body.password) {
            return res.send('you must enter a password')
        }
        if (req.body.password === user.password) {
            return res.send('the new password cant be the old password')
        }
        user.update({
            password: req.body.password
        })
        return res.send('password updated successfully')
    })
})

router.put('/api/updatePassword',async (req, res) => {
    console.log(req.body.password , req.body.newPassword , req.body.email)
    var user = await db.users.findOne({
        where:{
            email:req.body.email
        }
    })
    if(user){
      
        bcrypt.compare(req.body.password, user.password, function (err, isMatch) {
            if (err) {
                res.json({ message: 'error' })
            } else if (!isMatch) {
                res.json({ message: 'authentication failed' })
            } else {

                bcrypt.genSalt(10, function (err, salt) {
                    if (err) {
                        console.log(err)
                    } else {
                        bcrypt.hash(req.body.newPassword, salt, function (err, hash) {
                            if (err) {
                                console.log(err)
                            } else {
                                console.log(hash)
                                
                                                         console.log('new password',hash)
                                user.update({
                                  
                                    password: hash,
                                
                                }).then(
                                    res.json({ message: 'password updated successfully' })
                                    
                                   
                                    
                                    )
                            }
                        })
                    }
                })
            }
        })

               
      
          
       
    }
})



module.exports = router;