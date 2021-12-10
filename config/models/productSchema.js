const mongoose=require('mongoose')
const {Schema}=mongoose

const productSchema=new Schema({
    productName:{type:String,required:true},
    quantity:Number,
    data:[{type:String}]
})

module.exports=mongoose.model('products',productSchema)
