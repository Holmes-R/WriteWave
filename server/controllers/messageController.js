import { userSocketMap } from "../index.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import messageRouters from "../routes/messageRouters.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id; 
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")
        const unseenMessages = {}

        const promises = filteredUsers.map(async(user)=>{
            const message = await Message.find({senderId:user._id, receiverId:userId, seen:false})
            if(message.length > 0) {
                unseenMessages[user._id] = message.length;
            }
        })
        await Promise.all(promises)
        res.json ({
            success: true,
            users: filteredUsers,
            unseenMessages
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

export const getMessages = async (req, res) => {
    try {
        const {id:selectUserId} = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or:[
               {sender: myId}, {receiver: selectUserId},
                {sender: selectUserId}, {receiver: myId},
            ]
        })

        await Message.updateMany({senderId:selectUserId,receiverId:myId},{seen:true})
        res.json({success:true,message})
        
    } catch (error) {
        res.json({success:false, message:error.message});
    }
}

export const markMessageAsSeen = async (req, res) => {
   try{
        const {id} = req.params
        await Message.findByIdAndUpdate(id, {seen:true});
        res.json({success:true, message:"Message marked as seen"});
   }catch (error) {
       res.json({success:false, message:error.message});
   } 
}

export const sendMessage = async (req, res) => {
    try {
        const { content, image } = req.body;
        const receiverId = req.params.id; 
        const sender = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await imagekit.upload(image)
            imageUrl = uploadResponse.url

        }
        const newMessage = new Message({
            sender,
            receiver,
            content,
            image:imageUrl
        });

        const receiverSocketId = userSocketMap[receiverId]
        if(receiverId){
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.json({ success: true, message: newMessage });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}