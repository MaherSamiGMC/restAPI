const express=require('express')
const app=express()
require('dotenv').config()
const connectDB=require('./config/connectDB')
const products=require('./config/models/productSchema')
const users=require('./config/models/userSchema')
var cors = require('cors')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const logger = require('./middleware')

// to access req.body content 


// first step run express.json middleware
app.use(express.json())
//second step install & run cors package 
app.use(cors())

const saltRounds = 10;


connectDB()

//create new user

app.post('/newuser',async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await users.findOne({email})
        if (user){
            return res.json({message:'user already exists'})
        } else {
            const hashedPassword=await bcrypt.hash(password, saltRounds)
            const newUser=new users({...req.body,password:hashedPassword})
            await newUser.save()
            return res.json({message:'user added successfully'})
        }
    }catch (err){
        return res.json({message:err})
    }
})

app.post('/login',async(req,res)=>{
    try{
        const {email,password}=req.body
        const user=await users.findOne({email})
        if (!user){
            return res.json({message:'bad credentials'})
        }else {
            const match=await bcrypt.compare(password, user.password)
            if (!match){
                return res.json({message:'bad credentials'})
            } else {
                var token = await jwt.sign({id :user._id}, process.env.JWT_PRIVATE_KEY);
                return res.json({message:'user loggedIn successfully',user,token})
            }

        }

    }catch (err){
        return res.json({message:err})

    }
})

app.get('/users',async(req,res)=>{
    try {
        const listOfUsers=await users.find()
        return res.json({message:'users loaded successfully',data:listOfUsers})
    }catch (err){
        return res.json({message:err})

    }
})

app.post('/products/newproduct',async(req,res)=>{
    const newProduct=new products(req.body)
    const newData=await newProduct.save()
    res.json({message:'data added successfully',data:newData})
}) 

app.get('/products',logger,async(req,res)=>{
    const listofProducts= await products.find()
    res.json({message:'data loaded successfully',data:listofProducts})
})

app.get('/products/:id',async(req,res)=>{
    const myProduct=await products.findById(req.params.id)
    res.json({message:'product loaded successfully',data:myProduct})

})

app.put('/products/:id',async(req,res)=>{
    await products.findByIdAndUpdate(req.params.id,{$set:{...req.body}})
    const updatedProduct=await products.findById(req.params.id)
    res.json({message:'product updated successfully',data:updatedProduct})

})

app.delete('/products/:id',async(req,res)=>{
    const removedProduct=await products.findByIdAndDelete(req.params.id)
    res.json({message:'product deleted successfully',data:removedProduct})
})


const PORT= process.env.PORT || 4000

app.listen(PORT,()=>console.log(`app running on port ${PORT}`))