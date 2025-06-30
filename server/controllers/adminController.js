import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ success: false, message: "Invalid Credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default adminLogin

export const getAllBlogsAdmin = async (req, res) => {
  try{
    const blogs = await Blog.find({}).sort({ createdAt: -1 })
    res.json({ success: true, token });
  }catch(error){
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export const getAllComment = async (req, res) => {
  try{
    const comment = await Comment.find({}).populate('blog').sort({ createdAt: -1 });
    res.json({success:true,comments})
  }catch(error){
    res.json({ success: false, message: error.message });
  }
}

export const getDashboardData = async (req, res) => {
  try{
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const totalBlogs = await Blog.countDocuments();
    const commments = await Comment.countDocuments();
    const drafs = await Blog.countDocuments({isPublished:false})
    const dashboardData = {
      drafs,commments,totalBlogs,recentBlogs
    }
    res.json({success:true,dashboardData})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}

export const deleteCommentById = async(req,res) =>{
  try{
    const {id} = req.body;
    await Comment.findByIdAndDelete(id);
    res.json({success:true,message:"Comment Delete Successfully"})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}

export const approveCommentById = async(req,res) =>{
  try{
    const {id} = req.body;
    await Comment.findByIdAndUpdate(id,{isApproved:true});
    res.json({success:true,message:"Comment approved Successfully"})
  }catch(error){
    res.json({success:false,message:error.message})
  }
}