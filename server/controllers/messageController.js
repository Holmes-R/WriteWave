import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../index.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user.userId;
        
        // Get all users except the logged-in user
        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password");
        
        // Get unread message counts for each user
        const unreadCounts = {};
        await Promise.all(users.map(async (user) => {
            const count = await Message.countDocuments({
                sender: user._id,
                receiver: loggedInUserId,
                seen: false
            });
            if (count > 0) {
                unreadCounts[user._id] = count;
            }
        }));

        res.status(200).json({
            success: true,
            users,
            unreadCounts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: otherUserId } = req.params;
        const myId = req.user.userId;

        // Validate if other user exists
        const otherUser = await User.findById(otherUserId);
        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Get messages between two users, sorted by timestamp
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: otherUserId },
                { sender: otherUserId, receiver: myId }
            ]
        }).sort({ timestamp: 1 });

        // Mark received messages as seen
        await Message.updateMany(
            { sender: otherUserId, receiver: myId, seen: false },
            { $set: { seen: true } }
        );

        res.status(200).json({
            success: true,
            messages,
            otherUser: {
                _id: otherUser._id,
                username: otherUser.username,
                avatarUrl: otherUser.avatarUrl
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch messages",
            error: error.message
        });
    }
};

export const markMessageAsSeen = async (req, res) => {
    try {
        const { id: messageId } = req.params;
        
        const message = await Message.findByIdAndUpdate(
            messageId,
            { seen: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message marked as seen",
            updatedMessage: message
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to mark message as seen",
            error: error.message
        });
    }
};




export const sendMessage = async (req, res) => {
    try {
        const { content, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user.userId;

        // Validate required fields
        if (!content && !image) {
            return res.status(400).json({
                success: false,
                message: "Message content or image is required"
            });
        }

        // Check if receiver exists
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: "Receiver not found"
            });
        }

        // Create and save message
        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            content,
            image
        });

        // Populate sender/receiver details
        const populatedMessage = await Message.findById(newMessage._id)
            .populate('sender', 'username avatarUrl')
            .populate('receiver', 'username avatarUrl');

        // Notify receiver via Socket.IO if online
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", populatedMessage);
        }

        res.status(201).json({
            success: true,
            message: populatedMessage
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: "Failed to send message",
            error: error.message
        });
    }
};