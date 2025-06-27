import fs from 'fs';
import Blog from '../models/Blog.js'; // Fixed import (was User.js)
import imagekit from '../config/imageKit.js';
import { request } from 'http';

export const addBlog = async (req, res) => { // Changed from response to res
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file; // Changed from File to file
        
        if (!title || !description || !category || !imageFile) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path);
        const uploadResponse = await imagekit.upload({ // Changed variable name from response
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        });

        // Optimize through imageKit URL transformation
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

        // Clean up the temporary file
        fs.unlinkSync(imageFile.path);

        return res.status(201).json({ success: true, message: "Blog added successfully" });
     

    } catch (error) {
        console.error("Error adding blog:", error);
        console.log("req.body.blog:", request.body.blog);
console.log("req.file:", req.file);

        if (req.file?.path) {
            fs.unlinkSync(req.file.path); // Clean up if error occurs
        }
        return res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};