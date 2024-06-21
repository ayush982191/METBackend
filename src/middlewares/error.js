export const errorMiddleware = (err,req,res,next) =>{
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;
    return res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
} 

export const TryCatch = (func) =>{
    return (req,res,next) =>{
        return func(req,res,next).catch((err)=>next(err))
    }
}

