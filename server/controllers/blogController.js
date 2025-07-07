import fs from 'fs';
import Blog from '../models/Blog.js'; 
import imagekit from '../config/imageKit.js';
import { request } from 'http';

export const addBlog = async (req, res) => { 
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

        const imageFile = req.file;
        
        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const fileBuffer = fs.readFileSync(imageFile.path);
        const uploadResponse = await imagekit.upload({ 
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        const optimizedImageUrl = imagekit.url({
            path: uploadResponse.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' }, 
                { width: '1280' }
            ]
        });

        await Blog.create({
            title,
            subTitle,
            description,
            category,
            image: optimizedImageUrl,
            isPublished: isPublished || false
        });

        fs.unlinkSync(imageFile.path);

        return res.status(201).json({ success: true, message: "Blog added successfully" });
     

    } catch (error) {
        console.error("Error adding blog:", error);
        console.log("req.body.blog:", req.body.blog);
        console.log("req.file:", req.file);

        if (req.file?.path) {
            fs.unlinkSync(req.file.path); 
        }
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};


export const getAllBlog = async (req, res) => {
    try{
        const blogs = await Blog.find({ isPublished: true });
        res.json({ success: true, blogs });

    }catch(error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const getBlogById = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    return res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const incrementShareCount = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    blog.shares = (blog.shares || 0) + 1;
    await blog.save();

    res.json({ success: true, shares: blog.shares });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const DeleteBlogById = async (req, res) => {
    try {
            const { id } = req.body;
    await Blog.findByIdAndDelete(id);

    await Comment.deleteMany({blog:id})

        return res.json({ success: true, message: "Blog deleted successfully" });
      
    } catch (error) {
        res.json({ 
            success: false, 
            message: error.message
           
        });
    }
}

export const togglePublish = async (req, res) => {
    try{
            const { id } = req.body;
    const blog = await Blog.findById(id);

        blog.isPublished = !blog.isPublished;
        await blog.save();
        return res.json({ success: true, message: "Blog publish status updated",  });
    }catch(error) {
        res.json({ 
            success: false, 
            message: error.message
           
        });
    }
}

export const addComment = async (req, res) => {
    try{
        const {blog,name,content} = req.body;
        await Comment.create({blog,name,content})
        return res.json({ success: true, message: "Comment added successfully" });

    }catch(error) {
        console.error("Error adding comment:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            
        });
    }
}

export const getBlogComments = async (req, res) => {
    try{
        const {blogId} = req.body;
        const comments = await Comment.find({blog:blogId, isApproved:true}).sort({createdAt:-1});
        return res.json({ success: true, comments });
        
    }catch(error){
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
        });

    }
}

export const generateContent = async (req, res) => {
    try {
        const {prompt   } = req.body;
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format '  )
        res.json({success:true,content})
    } catch (error) {
        res.json({ 
            success: false, 
            message: error.message
        });
    }
}