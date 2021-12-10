const mongoose=require('mongoose')

const connectDB=()=>{
    mongoose.connect(process.env.URI_DB)
    .then(()=>console.log('db connected successfully'))
    .catch((err)=>console.log(err))
}

module.exports=connectDB