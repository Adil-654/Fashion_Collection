
import  mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import  dotenv from 'dotenv';
dotenv.config()
const customerSchema =new mongoose.Schema( {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    
    unique: true,
  },

  gender:{
    type:String,
    required:true,
  },

  message:{
    type:String,
  }

});



 const customer=mongoose.model("customer",customerSchema)
export default customer


