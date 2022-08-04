

const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel")

////  authentication_Part  ////

const auth =async (req ,res , next) =>{

try {

    let token = req.headers["x-api-key"]
    if(!token){
        return res.status(400).send( { status : false , msg : "token Must Be Present , You Have To Login First" } )
    }

    let decodeToken = jwt.verify(token,"this-is-aSecretTokenForLogin")
    if(!decodeToken){
        return res.status(401).send( { status : false , msg : "Invalid Token" } )
    }

    let data = req.params

    if(Object.keys(data).length !== 0){

        if(data.userId !== decodeToken.userId){
            return res.status(403).send( { status : false , msg :"you are Not Authorized !" } )
        }

    }else{

        let userId = req.params.userId
        let isValidUser = await userModel.findById(userId)
        if(!isValidUser){
            return res.status(403).send({status : false , msg : "you do not Have access to This data !"})

        }
        
    }
    
  
  next()

} catch (error) { 
    return res.status(500).send( { Error : error.message } )
}
};

module.exports.auth = auth