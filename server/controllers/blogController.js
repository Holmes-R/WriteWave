import fs from 'fs'
import ImageKit from 'imagekit'
import imagekit from '../config/imageKit'
import Blog from '../models/User'
export const addBlog = async(request,response)=>{
    try {
        const {title,subTitle,description,category,isPublished}=JSON.parse(request.body.blog)
        const imageFile = request.File
        if(!title || !description || !category || !imageFile){
            return response.json({success:false,message:"Missing required fields"})
        }
        //Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response  = await imagekit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        })

        //Optimize through imageKit URL transformtion .
        const optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation :[
                {quality:'auto'},
                {format:'webp'}, 
                {width:'1280'}
            ]
        })
        
        const image = optimizedImageUrl

        await Blog.create({title,subTitle,description,category,image,isPublished})

        return response.json({success:true,message:"Blog added successfully"})

    } catch (error) {
        
    }
}