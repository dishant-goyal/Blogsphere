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
  "https://yourdomain.com", // production domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // if using cookies / sessions
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