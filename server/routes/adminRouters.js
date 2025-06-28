import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComment, getDashboardData } from "../controllers/adminController.js";
import express from "express"
import auth from "../middleware/auth.js";
import { getAllBlog } from "../controllers/blogController.js";



const adminRouter = express.Router()

adminRouter.post("/login",adminLogin)
adminRouter.get('/comments',auth ,getAllComment)
adminRouter.get('/blogs',auth,getAllBlogsAdmin)
adminRouter.post('delete-comment',auth,deleteCommentById)
adminRouter.post("approve-comment",auth,approveCommentById)
adminLogin.get('/dashboard',auth,getDashboardData)

export default adminRouter