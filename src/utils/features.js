 
import mongoose from "mongoose"
import { myCache } from "../index.js"
import { Product } from "../models/product.js"

 const connectDB = () =>{
    mongoose.connect("mongodb://localhost:27017",{
        dbName : "Ecommerce_24"
    }).then(()=>console.log("Connected to DB"))
    .catch((error)=>console.log(error))
}
export default connectDB
export const invalidateCache =async ({product,order,admin}) =>{
    if(product){
        const productKeys = ["latest-product","category","all-product"];
        const products = await Product.find({}).select("_id");
        products.forEach(i => {
            productKeys.push(`product-${i._id}`)          
        });
        myCache.del(productKeys);
    }
    if(admin){

    }
    if(order){

    }
    
    
}

export const reduceStock = async(orderItems) =>{
    for(let i=0;i<orderItems.length;i++){
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product){
            throw new Error("3")
        }

    }

}