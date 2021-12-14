var jwt = require('jsonwebtoken');
const users=require('./config/models/userSchema')

const logger=async(req,res,next)=>{
    try {
        const token=req.headers['auth']
        if (!token){
            return res.json({message:'not authorized'})
        }
        var decoded = await jwt.verify(token,process.env.JWT_PRIVATE_KEY)
        const user=await users.findById(decoded.id)
        if (!user){
            return res.json({message:'not authorized'})
        }
        next()
    } catch (err){
        return res.json({message:err})
    }


}

module.exports=logger