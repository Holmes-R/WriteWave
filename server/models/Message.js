import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content :{
        type:String,
        required:true
    },
    timestamp :{
        type:Date,
        default : Date.now
    },
    image :{
        type:String,
        default:null
    },
    seen:{
        type:Boolean,
        default:false
    }

})

const Message = mongoose.models.message || mongoose.model('message', messageSchema);
export default Message 
