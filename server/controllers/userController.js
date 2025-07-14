import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 




export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body || {};

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email and password are required',
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      avatarUrl: null, // Avatar can be updated later
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};



export const getProfile = async (req, res) => {
  try {
    console.log("Hari haran")
    const { id } = req.params;
    console.log(req.params.id)
    console.log(req.body);

    const user = await User.findById(id).select('-password');

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Payload must match what auth middleware expects
    const token = jwt.sign(
      {
        userId: user._id.toString(), // Ensure this is a string
        email: user.email,
        role: user.role || 'user' // Default role if not specified
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { id: requestedUserId } = req.params;
    const { username: newUsername, bio } = req.body || {};
    const avatar = req.file;
    console.log(req.body);

    if (req.user.userId !== requestedUserId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to edit this profile"
      });
    }

    const user = await User.findById(requestedUserId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }


    if (newUsername) user.username = newUsername;
    if (bio) user.bio = bio;
    if (avatar) {
      user.avatarUrl = `/uploads/avatars/${avatar.filename}`;
    }

    await user.save();

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: user.username,
        bio: user.bio,
        avatarUrl: user.avatarUrl
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
