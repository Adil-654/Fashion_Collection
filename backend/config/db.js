import  mongoose from 'mongoose';

 const conn = mongoose.connect('mongodb+srv://adilahmadshah7860:alima7860@cluster0.m6koqgt.mongodb.net/Flipkart')
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });


export default conn