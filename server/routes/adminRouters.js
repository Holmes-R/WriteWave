import { adminLogin } from "../controllers/adminController.js";
import express from "express"



const adminRouter = express.Router()

adminRouter.post("/login",adminLogin)

export default adminRouter