import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './Database/db.js';
dotenv.config({
    path: './.env'
});
const app=express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


const port=process.env.PORT || 5001

connectDB();
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})

