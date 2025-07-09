// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Must exactly match the model name
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        default: null
    },
    seen: {
        type: Boolean,
        default: false
    }
});

// Check if model already exists before creating
const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export default Message;