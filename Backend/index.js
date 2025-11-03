import app from "./src/app.js";
import connectDB from "./src/db/index.js";

const port=process.env.PORT||4000;

connectDB().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is running on the http://localhost:${port}`)
    })
})


