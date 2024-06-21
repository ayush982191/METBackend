import express from "express"
import { userRoute ,  productRoute , orderRoute } from "./routes/allRoute.js";
  
import  connectDB  from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache"; 
import morgan from "morgan";


export const myCache = new NodeCache();



const app = express();
app.use(express.json())
app.use(morgan("dev"))
connectDB();


app.get("/",(req,res)=>res.status(201).json({ success : true,message : "Home page" }))
// using Routes 
app.use("/api/v1/user",userRoute);
app.use("/api/v1/product",productRoute);

 


app.use("/uploads",express.static("uploads"))
app.use(errorMiddleware)



const port = 4000;
app.listen(port,()=>console.log("Listening to port ",port));