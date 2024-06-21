import { TryCatch } from "../middlewares/error.js";
import Order from "../models/order.js";




const  newOrder = TryCatch(async(req,res,next)=>{
    console.log("new Order");
    const {shippingInfo , orderItems,user,subtotal,tax,shippingCharges,discount,total  } = req.body;
    await Order.create({
        shippingInfo,
        shippingCharges,
        orderItems,
        user,
        subtotal,
        tax,
        discount,
        total
    })

})


export {newOrder}

