import mongoose from "mongoose";
import { User } from "./user";

const orderSchema = mongoose.Schema({
    shippingInfo : {
        type : string,
        required : [true,"Enter shipping Info"]
    },
    city : {
        type : String,
        required : [true,"Enter city address"]
    },
    state : {
        type : String,
        required : [true,"Enter state"]
    },
    country : {
        type : String,
        required : [true,"Enter country name"]
    },
    user : {
        type : String,
        ref : User,
        required : true,
    },
    pincode : {
        type : Number,
        required : [true,"Pincode is important"]
    },
    subtotal : {
        type : Number,
        required : true
    },
    discount : {
        type : Number,
        required : true
    },
    total : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        enum : ["processing","Shipped","Delivered"],
        default : "processing"
    },
    orderItems : [{
        name : String,
        photo : String,
        price : Number,
        quantity : Number,
        productId : {
            type : mongoose.Types.ObjectId,
            ref : "Product",
            
        }
    }]


},{
 timestamps : true   
})




const Order = mongoose.model("order",orderSchema);
export default Order;