import express from "express";
import { deleteProduct, getAdminProducts, getAllCategories,   getAllProducts,   getLatestProduct, getSingleProduct, newProduct, updateProduct } from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();
// app.post("/new",adminOnly,singleUpload,newProduct);
app.post("/new",singleUpload,newProduct);

app.get("/latest",getLatestProduct);
app.get("/category",getAllCategories);
app.get("/admin-products",getAdminProducts);
app.get("/all",getAllProducts)
app.route("/:id").get(getSingleProduct).put(updateProduct).delete(deleteProduct)
        
export default app;

