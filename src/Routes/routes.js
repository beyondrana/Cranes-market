import { Router } from "express";
import  {registerUser, loginUser, logoutUser } from "../Controllers/auth.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";
import { addProduct } from "../Controllers/product.controller.js";
import { upload } from "../Middleware/multer.middleware.js";

const router=Router();


// signup, login, logout routes
router.post('/signup',registerUser);
router.post('/login',loginUser);
router.get('/logout',verifyJWT,logoutUser);


// products
router.post('/add-product',verifyJWT,upload.array("images", 4),addProduct); 










export default router;