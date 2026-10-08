const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.statusCode = 400;
      throw new Error('Please enter all required fields (name, email, password)');
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.statusCode = 400;
      if (userExists.status === 'blocked') {
        throw new Error('This account is deactivated by admin');
      }
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: 'user', // force standard user role
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
        },
      });
    } else {
      res.statusCode = 400;
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password, roleType } = req.body;

    if (!email || !password) {
      res.statusCode = 400;
      throw new Error('Please enter email and password');
    }

    // Check for user email (with password selected explicitly)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    if (user.status === 'blocked') {
      res.statusCode = 403;
      throw new Error('Your account is blocked. Please contact administration.');
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    
    // Check if the requested roleType matches the actual user role
    if (roleType && isMatch) {
      if (roleType === 'user' && user.role !== 'user') {
        res.statusCode = 403;
        throw new Error('Please select the Official tab to log in with an administrative account.');
      }
      if (roleType === 'admin' && user.role === 'user') {
        res.statusCode = 403;
        throw new Error('Please select the Citizen tab to log in with a citizen account.');
      }
    }

    if (!isMatch) {
      res.statusCode = 401;
      throw new Error('Invalid email or password');
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user details (current logged in)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.password) {
      user.password = req.body.password;
    }

    if (req.file) {
      user.avatar = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        status: updatedUser.status,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password (simulated link output)
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found with that email');
    }

    // Simulate recovery link
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'fallback_secret_key', { expiresIn: '15m' });
    const resetLink = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    console.log(`[PASSWORD RESET SIMULATION] Recovery link sent to ${email}: ${resetLink}`);

    res.json({
      success: true,
      message: 'Password reset link sent (simulated check terminal logs)',
      // For demo convenience, return token link in response
      resetLink,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   POST /api/auth/resetpassword/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.statusCode = 400;
      throw new Error('Please enter a password with 6 or more characters');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    const user = await User.findById(decoded.id);

    if (!user) {
      res.statusCode = 404;
      throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  forgotPassword,
  resetPassword,
};

