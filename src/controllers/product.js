import { faker } from "@faker-js/faker";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../index.js";
import { invalidateCache } from "../utils/features.js";


// New Product api/v1/product/new
export const newProduct = TryCatch(async(req,res,next)=>{
    const {name,price,stock,category} = req.body;
    const photo = req.file;
    if(!name || !price || !stock ||  !category )
        return next(new ErrorHandler("Please enter all fields",401));
    if(!photo)
        return next(new ErrorHandler("Photo is not defined",409));
    const product = await Product.create({
        name, price, stock, category : category.toLowerCase() , photo : photo?.path
    })
    await invalidateCache({ product : true })
    return res.status(201).json({
        success : true,
        message : "Product created Sucessfully"
    })

})
// Get Latest Product api/v1/product/latest
// Revalidate on New/Update/Delete/New order
export const getLatestProduct = TryCatch(async (req,res,next)=>{
    let products = [];
    if(myCache.has("latest-product")){
          products = JSON.parse(myCache.get("latest-product"));
    }else{
        products =await Product.find({}).sort({createdAt : -1} ).limit(5);
        myCache.set("latest-product",JSON.stringify(products))
    }
    
    return res.status(201).json({
        success : true,
        message : products
    })
})
// All categories api/v1/product/category
// Revalidate on New/Update/Delete/New order
export const getAllCategories = TryCatch(async (req,res,next)=>{
    let categories;
    if(myCache.has("categories"))
        categories = JSON.parse(myCache.get("categories"))
    else{
         categories = await Product.distinct("category");
        myCache.set("category",JSON.stringify(categories))
    }



    return res.status(201).json({
        status : true,
        message : categories
    })
    
})
// api/v1/product/admin-products
// Revalidate on New/Update/Delete/New order
export const getAdminProducts = TryCatch(async(req,res,next)=>{
    const  product = [];
    if(myCache.has("admin")){
        product = JSON.parse(myCache.get("admin"));
        
    }else{
        product = await Product.find({});
        myCache.set("admin",JSON.stringify(product))

    }
    
    return res.status(201).json({
        status : "success",
        message : product
    })
})

export const getSingleProduct = TryCatch(async(req,res,next)=>{
    const {id} = req.params ;
    const product = [];
    console.log("coming in get Single Product ",id)
        if(myCache.has(`product-${id}`)){
            product = JSON.parse(myCache.get(`product-${id}`));
        }
    else{
          product =await Product.findById(id);
          myCache.set(`product-${id}`,JSON.stringify(product))
        }
    
    if(!product)
        next(new ErrorHandler("Product not found",401));
    console.log("Last")
      res.status(201).json({
        success : true,
        message : product 
    })
})

export const updateProduct = TryCatch(async (req,res,next)=>{
    const {id} = req.params;
    const {name,stock,category,price} = req.body;
  

    const product =await Product.findById(id);
    console.log("name=",product.name ," and price=",product.price)
    if(!product)
        next(new ErrorHandler("product does not exist",400));
    if(name)
        product.name = name;
    if(stock)
        product.stock = stock;
    if(category)
        product.category = category;
    if(price)
        product.price = price;
    await product.save()
    invalidateCache({product : true})
    res.status(201).json({
        success : true,
        message : "product updated successfully"
    })

})

export const deleteProduct = TryCatch(async(req,res,next)=>{
    const {id} = req.params;
    const product = Product.findById(id);
    // console.log("prodcut = ",product.name)
    if(!product.name)
        return next(new ErrorHandler("Product is not found",400));
    await Product.findByIdAndDelete(id);
    await invalidateCache({product : true})
    res.status(201).json({
        success : true,
        message : "Product deleted successfully"
    })
})

export const getAllProducts = TryCatch(async(req,res,next)=>{
    console.log("coming in all product")
    const {search , sort, category, price} = req.query;
    const page = Number(req.query.page) || 1 ;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8 ;
    const skip = limit*(page - 1);
    // const baseQuery = {
    //     name : ,
    //     price : ,
    //     category 
    // } 
    const baseQuery = {}
    if(search)
        baseQuery.name = {
            $regex : search,            // this is to search the query
            $options : 'i'              // this is for case sensitive
        }
    if(price)
        baseQuery.price = {
            $lte : Number(price),          // lte means : lessthan,equal to
        }
    if(category)
        baseQuery.category = category;

 
    const [products,filteredOnlyProduct]= await Promise.all([
        Product.find(baseQuery).sort(sort && {price :sort === "asc" ?  1 : -1}).limit(limit).skip(skip),
        Product.find(baseQuery)
    ])
   


    // const products = await ;
    // const filteredOnlyProduct = await ;
    const totalPage = Math.ceil(products.length/limit);
    return res.status(201).json({
        success : true,
        products,
        totalPage
    })




 
})

export const generateRandomProduct = TryCatch(async(count)=>{
    const products=[];
    for(let i=0;i<count;i++){
        const prod={
            name : faker.commerce.productName(),
            photo : "uploads\\a5d2622a-c181-43fc-a624-9c64cd575ad2.png",
            price : faker.commerce.price({min:1500,max:80000,dec:0}),
            stock : faker.commerce.price({min:0,max:100,dec:0}),
            category : faker.commerce.department(),
            createdAt : new Date(faker.date.past()),
            updatedAt : new Date(faker.date.recent()),
            __v : 0
        }
        products.push(prod);
    }
    await Product.create(products);
    console.log("{success : true}")
})
// generateRandomProduct(10)

export const deleteRandomProduct = TryCatch(async(req,res,next)=>{
    const products = await Product.find({}).skip(2);
    for(let i=0;i<products.length;i++){
        const product = products[i];
        await product.deleteOne();
    }

})

// console.log("Helllo")