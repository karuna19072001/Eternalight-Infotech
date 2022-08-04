const userModel = require('../models/userModel')
const validator = require('../validator/validators')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

/******************** REFISTER ****************************/
const register = async function (req, res) {
    try {
        let {
            name,
            email,
            password
        } = req.body

        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({
                status: false,
                msg: "data required for login"
            })
        }

        //name validation
        if (!validator.isValid(name)) {
            return res.status(400).send({
                status: false,
                message: 'Enter a Proper name'
            })
        }
        if (!validator.isValidCharacters(name)) {
            return res.status(400).send({
                status: false,
                message: 'Name does not contain a this attribute'
            })

        }

        // email validation

        if (!validator.isValid(email)) {
            return res.status(400).send({
                status: false,
                message: 'Email is required'
            })
        }

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({
                status: false,
                message: 'Please enter a valid email'
            })
        }

        let isEmailExist = await userModel.findOne({
            email
        })
        if (isEmailExist) {
            return res.status(400).send({
                status: false,
                message: `This email ${email} is Already In Use`
            })
        }

        // password validation

        if (!validator.isValid(password)) {
            return res.status(400).send({
                status: false,
                message: 'password Is Required'
            })
        }

        if (!validator.isvalidPass(password.trim())) {
            return res.status(400).send({
                status: false,
                message: `password Should Be In Beetween 8-15 `
            })
        }

        let hashedPassword = await validator.hashedPassword(password.trim())
        console.log(hashedPassword.length)


        let finalData = {
            name,
            email,
            password
        }

        const newUser = await userModel.create(finalData)
        return res.status(201).send({
            status: true,
            message: 'Success',
            Data: newUser
        })


    } catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}


/********************************** USER LOGIN ******************************************/

const userLogin = async function (req, res) {


    try {

        let userName = req.body.email;
        let password = req.body.password;

        let user = await userModel.findOne({
            email: userName,
            password: password
        });

        if (!user)
            return res.status(404).send({
                status: false,
                msg: "User Not Found",
            });


        let token = jwt.sign({
                userId: user._id.toString(),
            },
            "this-is-aSecretTokenForLogin"
        );
        res.setHeader("x-api-key", token);
        res.status(201).send({
            status: true,
            data: token
        });



    } catch (error) {
        return res.status(500).send({
            Err: error.message
        })
    }

};



const updateUser = async (req, res) => {

    try {

        let Id = req.params.userId
        let ifExist = await userModel.findById(Id)

        if (!ifExist) {
            return res.status(404).send({
                status: false,
                msg: "user Not Found"
            })
        }

        if (ifExist.isDelete == false) {

            let password = req.body.password

            let updatedUser = await userModel.findByIdAndUpdate({
                _id: Id
            }, {
                $set: {
                    password: password,
                    publishedAt: Date.now()
                }
            }, {
                new: true
            })

            console.log(updatedUser)
            return res.status(200).send({
                Status: true,
                data: updatedUser
            })

        }

    } catch (error) {
        res.status(500).send({
            status: false,
            msg: error.message
        })
    }
}



/************************* USER LOGOUT ***********************/

const UserLogout = (req, res) => {
    try {

        userSchema.methods.deleteToken=function(token,cb){
            var user=this;
        
            user.update({$unset : {token :1}},function(err,user){
                if(err) return cb(err);
                cb(null,user);
            })
        }
        req.user.deleteToken(req.token,(err,user)=>{
            if(err) return res.status(400).send(err);
            res.sendStatus(200);
        });

    } catch (err) {
        return res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}


module.exports = {
    register,
    userLogin,
    updateUser,
    UserLogout
}