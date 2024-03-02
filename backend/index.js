import express from "express";
import conn from "./config/db.js";
import User from "./models/userSchema.js";

import bodyParser from "body-parser";
import { validationResult, body } from "express-validator";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const app = express();

import dotenv from "dotenv";
dotenv.config();
var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const secretkey = "jwtsecretstring";

app.get("/", (req, res) => {
  res.send("Hedllo");
});

app.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Length is short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let token;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const validUser = await User.findOne({ email: email });

      if (!validUser) {
        res.status(400).json({ message: "Invalid Credentials" });
      }
      const ismatch = await bcrypt.compare(password, validUser.password);
      //token generation
      // token = await validUser.generateAuthToken();

      const data = {
        user: {
          id: validUser.id,
        },
      };
      const authToken = jwt.sign(data, secretkey);
      if (ismatch) {
        res.status(200).json({
          message: "Login successful",
          token: authToken,
          user: validUser,
        });
      }
    } catch (err) {
      console.log("Internal Server Error");
    }
  }
);

app.get("/users", async (req, res) => {
  try {
    const user = await User.find({}, { password: 0 });
    if (!user || users.length === 0) {
      return res.status(404).json({ message: "User not Found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
});

app.post(
  "/register",
  [
    body("name", "Name is short").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Length is short").isLength({ min: 5 }),
    body("cpassword", "Length is short").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    try {
      const checkUser = await User.findOne({ email: req.body.email });
      if (checkUser) {
        return res
          .send(400)
          .json({ message: "User with this email already exists" });
      }
      const { name, email, password, cpassword } = req.body;
      // const FindUser = await User.findOne({ email });
      //hash the passowrd
      const saltRound = 10;
      const hash_password = await bcrypt.hash(password, saltRound);

      let user = new User({ name, email, password: hash_password, cpassword });
      user = await user.save();
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, secretkey);
      res.json({ authToken });
    
    } catch (err) {
      console.log(err);
    }
  }
);

app.get("/forgot-user", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.send("user Not Exist");
    }
    const secret = process.env.SECRET_KEY + oldUser.password;
    
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
   
    const link = `http://localhost:4000/reset-password/${oldUser._id}/${token}`;
   
    console.log(link)
   
  } catch (error) {
      
  }
});

app.get('/reset-password/:id/:Token',async (req,res)=>{
  const {id,Token}=req.params;
  
  const oldUser = await User.findOne({ _id:id });
  if (!oldUser) {
    return res.send("user Not Exist");
  }
  const secret = process.env.SECRET_KEY + oldUser.password;
  try{
      const verify=jwt.verify(token,secret)
      res.render("reset_pass",{email:verify.email});
  }
  catch(error){
 
      res.send('not verified')
  }

})

app.post('/reset-password/:id/:Token',async (req,res)=>{
  const {id,token}=req.params;
  const {password}=req.body;
  const oldUser = await User.findOne({ _id:id });
 
  if (!oldUser) {
    return res.send("user Not Exist");
  }
  const secret = process.env.SECRET_KEY + oldUser.password;
  try{
      const verify=jwt.verify(token,secret)
      const encryptedpassword=await bcrypt.password(password,10)
      await User.updateOne({
        _id:id,
      },
      {
        $set:{
          password:encryptedpassword,
        }
      }
      
      
      )
      res.render("reset_pass",{email:verify.email});
  }
  catch(error){
    console.log(error)
      res.send('not ')
  }

})




app.listen(4000, () => {
  console.log(`Server is running at port ${4000}`);
});
