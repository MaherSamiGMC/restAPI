const express=require('express')
const app=express()
require('dotenv').config()
const connectDB=require('./config/connectDB')
const products=require('./config/models/productSchema')
var cors = require('cors')
// to access req.body content 

// first step run express.json middleware
app.use(express.json())
//second step install & run cors package 
app.use(cors())

connectDB()

app.post('/products/newproduct',async(req,res)=>{
    const newProduct=new products(req.body)
    const newData=await newProduct.save()
    res.json({message:'data added successfully',data:newData})
})

app.get('/products',async(req,res)=>{
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