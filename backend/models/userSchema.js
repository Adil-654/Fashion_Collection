
import  mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import  dotenv from 'dotenv';
dotenv.config()
const userSchema =new mongoose.Schema( {
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cpassword: {
    type: String,
    required: true,
  },
  // tokens:[
  //   {
  //     token:{
  //     type: String,
  //   required: true,
  //     }
  //   }
  // ]
});

// userSchema.methods.generateAuthToken=async function(){
//   try{
//       let newtoken=jwt.sign({_id:this._id},process.env.SECRET_KEY,{
//         expiresIn:10
//       })

//       this.tokens=this.tokens.concat({token:newtoken});
//       await this.save()
//       return newtoken;
//   }
//   catch(err){
//     console.log(err)
//   }
// }


 const User=mongoose.model("User",userSchema)
export default User


