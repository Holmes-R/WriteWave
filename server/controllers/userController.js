export const register = async (req, res) => {
    try{
        const { username, email, password } = req.body;
        const avatar = req.file
        if (!username || !email || !password) {
            return res.json({
                success: false,
            })
    }
    const existingUser = await User.findOne({email});
    if(existingUser) {
        return res.json({
            success: false,
            message: 'Email already exists'
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        avatarUrl: avatar ? `server/uploads/avatars/${avatar.filename}` : null, // Store the file path if avatar is uploaded
    });
   return res.json({
        success: true,
        message: 'User registered successfully',
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            avatarUrl: newUser.avatarUrl,
        }
    });
}
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
}
export const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
