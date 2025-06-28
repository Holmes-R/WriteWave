import jwt from 'jsonwebtoken';

const auth =(request,response,next)=>{
    const token = request.headers.authorization;
    try {
        jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        response.json({success:false,message:"Invalid token"})
    }
}
export default auth
