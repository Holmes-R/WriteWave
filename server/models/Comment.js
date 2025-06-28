import mongoose, { mongo } from "mongoose";


const blogSchema = new mongoose.Schema({

    blog : {type:mongoose.Schema.Types.ObjectId, ref: 'blog', required:true},
    name :{
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },

},{timestamps:true})

const Blog = mongoose.model('blog',blogSchema)
export default Blog

