import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";

// route : /api/v1/user/new
 const newUser =TryCatch(async (req,res,next) =>{
     
        const {name,email,photo,gender ,_id,dob} = req.body; 
        if(!name)
            next(new ErrorHandler("name is not present",400))
            
        if(!email)
            next(new ErrorHandler("email is not present",400))
             
        if(!photo)
            next(new ErrorHandler("photo is not present",400))
           
        if(!gender) 
            next(new ErrorHandler("gender) is not present",400))
        
        if(!dob)
            next(new ErrorHandler("dob is not present",400))
             
        // console.log("coming to create user");
        let user = User.findById(_id);
        // console.log("existing user is ",user.name)
        if(user._id){
            return res.status(201).json({
                status : true,
                message : `Welcome existing user  ${user.name}`
            })
        }


          user =await User.create({
            name,email,photo,gender,_id,dob : new Date(dob)
        })
        // console.log("creating user ",user)
        await user.save();
        // console.log("After create user");


        res.status(201).json({
            status : true,
            message : `Welcome  ${name}`
        })
   
})

// route : /api/v1/user/all
const allUser = TryCatch(async(req,res,next)=>{
    // res.status(201).send("All users ")
    const users = await User.find({});
    return res.status(201).json({
        success : true,
        users
    })

})

// find User route : /api/v1/user/:id(dynamic id)   
const getUser = TryCatch(async(req,res,next)=>{
    const { id } = req.params;
    const user = await User.findById(id);
    if(!user)
        return next(new ErrorHandler("User not Found",400));
    res.status(201).json({
        success : true,
        user
    })


})

//  delete User route : /api/v1/user/:id(dynamic id)
const deleteUser = TryCatch(async(req,res,next)=>{
    const {id} = req.params;
    const user =await User.findById(id);
    
    if(!user)
        return next(new ErrorHandler("User not found",400));
    await user.deleteOne();
    return res.status(201).json({
        success : true,
        message: "User delted successfully"
    })

})






export {newUser,allUser,getUser,deleteUser}