import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatarUrl: { type: String },
  bio: { type: String },
  joinDate: { type: Date, default: Date.now },
  lastPostedAt: { type: Date },
});

const User = mongoose.models.user || mongoose.model('user', UserSchema);
export default User;
