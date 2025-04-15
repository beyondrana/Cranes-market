import { Router } from "express";
import  {registerUser, loginUser, logoutUser } from "../Controllers/auth.controller.js";
import { verifyJWT } from "../Middleware/auth.middleware.js";

const router=Router();


// signup, login, logout routes
router.post('/signup',registerUser);
router.post('/login',loginUser);
router.get('/logout',verifyJWT,logoutUser);













export default router;