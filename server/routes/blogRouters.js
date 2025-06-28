import express from 'express';
import { addBlog, addComment, DeleteBlogById, getAllBlog, getBlogById,getBlogComments,togglePublish } from '../controllers/blogController.js';
import upload from '../middleware/multer.js';
import auth from '../middleware/auth.js';

const blogRouter = express.Router();

blogRouter.post('/add',upload.single('image'),auth, addBlog)
blogRouter.get('/all',getAllBlog)
blogRouter.get('/:id', getBlogById); 
blogRouter.post('/delete',auth,DeleteBlogById)
blogRouter.post('/togglePublish', auth,togglePublish); 
blogRouter.post('/add-comment',addComment)
blogRouter.post('/comments',getBlogComments)
export default blogRouter
