

const allUser = (req,res,next) =>{
    console.log("coming to all user")
    res.status(201).json({
        message : "Welcome bhai"
    })

}
export {allUser}