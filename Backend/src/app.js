import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from "cors"

import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
dotenv.config()
const app=express()



const allowedOrigins = [
  "http://localhost:5173", // React dev server
  "https://blogsphere-orcin.vercel.app/", // production domain
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // ✅ Required for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // optional but good practice
    allowedHeaders: ["Content-Type", "Authorization"], // optional
  })
);

app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/post",postRoutes)



app.get('/',(req,res)=>{
    res.send("ram ram ji jai ganesh")
})

    
export default app