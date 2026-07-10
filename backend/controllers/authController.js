const { User } = require('../models');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');
const { sendEmail } = require('../services/emailService');
const cloudinary = require('../config/cloudinary');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Generate a 6-digit verification code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      isVerified: false,
      otpCode,
      otpExpiry
    });

    if (user) {
      // Send OTP verification email
      sendEmail({
        to: user.email,
        subject: 'Verify your NammaService Account - Verification Code',
        text: `Hello ${user.name},\n\nThank you for signing up for NammaService! To verify your email, please use the following 6-digit verification code:\n\n${otpCode}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this, please ignore this email.`,
        userId: user.id
      }).catch(err => console.error('Verification email failed:', err.message));

      res.status(201).json({
        success: true,
        message: 'Verification OTP sent to your email. Please verify to complete signup.',
        email: user.email
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        res.status(403).json({
          message: 'Please verify your email address first.',
          email: user.email,
          unverified: true
        });
        return;
      }

      // Trigger Email (non-blocking)
      sendEmail({
        to: user.email,
        subject: 'Security Alert: New Login Detected',
        text: `Hello ${user.name},\n\nA new login was detected on your NammaService account. If this was not you, please secure your credentials immediately.`,
        userId: user.id
      }).catch(err => console.error('Login alert email failed:', err.message));

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user.id)
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: require('../models').Professional, as: 'savedProfessionals' }]
    });

    if (user) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        savedProfessionals: user.savedProfessionals ? user.savedProfessionals.map(p => p.id) : []
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    console.log('Update User Profile API invoked.');
    console.log('Content-Type:', req.headers['content-type']);
    if (req.file) {
      console.log('Multer file received:', req.file.originalname, 'Size:', req.file.size);
    }
    if (req.body.avatar) {
      console.log('Avatar data type:', typeof req.body.avatar, 'Length:', req.body.avatar.length);
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    let avatarUrl = user.avatar;

    // 1. Upload Multer parsed file to Cloudinary
    if (req.file) {
      try {
        console.log('Uploading file buffer to Cloudinary...');
        const base64Image = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'nammaservice/avatars'
        });
        
        console.log('Cloudinary file upload success. URL:', result.secure_url);
        avatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary file upload error:', uploadErr);
        res.status(500);
        throw new Error(`Cloudinary upload failed: ${uploadErr.message}`);
      }
    } 
    // 2. Upload Base64 data URL to Cloudinary
    else if (req.body.avatar && req.body.avatar.startsWith('data:image')) {
      try {
        console.log('Uploading Base64 data string to Cloudinary...');
        const result = await cloudinary.uploader.upload(req.body.avatar, {
          folder: 'nammaservice/avatars'
        });
        
        console.log('Cloudinary Base64 upload success. URL:', result.secure_url);
        avatarUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary Base64 upload error:', uploadErr);
        res.status(500);
        throw new Error(`Cloudinary upload failed: ${uploadErr.message}`);
      }
    } 
    // 3. Keep existing avatar URL if it is already a plain URL
    else if (req.body.avatar) {
      console.log('Plain avatar URL received, using directly:', req.body.avatar);
      avatarUrl = req.body.avatar;
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = avatarUrl;

    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.body.role) {
      user.role = req.body.role;
    }

    await user.save();
    console.log('User profile saved successfully in DB. Saved Avatar URL:', user.avatar);

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id)
    });
  } catch (error) {
    console.error('Profile update controller failed:', error.message);
    next(error);
  }
};

// @desc    Forgot password request
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404);
      throw new Error('User with this email does not exist');
    }

    const token = generateToken(user.id);
    const resetUrl = `https://nammaservice-app.web.app/reset-password/${token}`;

    // Send reset link to email (non-blocking)
    sendEmail({
      to: user.email,
      subject: 'NammaService Password Reset Request',
      text: `Hello ${user.name},\n\nYou requested a password reset. Please click the link below to set a new password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
      userId: user.id
    }).catch(err => console.error('Forgot password email failed:', err.message));

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email!',
      resetUrl
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400);
      throw new Error('Please enter a password with 6 or more characters');
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      res.status(400);
      throw new Error('Invalid or expired password reset token');
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    const formatted = users.map(u => {
      const data = u.toJSON();
      data._id = data.id;
      return data;
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    
    await user.destroy();
    
    res.status(200).json({
      success: true,
      message: 'User removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400);
      throw new Error('Please provide email and OTP');
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User is already verified');
    }

    const inputOtp = otp.toString().trim();
    const isBypass = process.env.NODE_ENV === 'development' && inputOtp === '123456';

    if (user.otpCode !== inputOtp && !isBypass) {
      res.status(400);
      throw new Error('Invalid OTP code. (For local testing, you can use bypass code: 123456)');
    }

    if (!isBypass && new Date() > new Date(user.otpExpiry)) {
      res.status(400);
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Mark as verified, clear OTP fields
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    // Trigger welcome email (non-blocking)
    sendEmail({
      to: user.email,
      subject: 'Welcome to NammaService!',
      text: `Hello ${user.name},\n\nYour account has been verified and registered successfully. You can now search and book verified local service professionals near you!`,
      userId: user.id
    }).catch(err => console.error('Welcome email failed:', err.message));

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      token: generateToken(user.id)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Please provide email');
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (user.isVerified) {
      res.status(400);
      throw new Error('User is already verified');
    }

    // Generate new OTP (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otpCode;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send email with OTP
    sendEmail({
      to: user.email,
      subject: 'Your NammaService Verification Code',
      text: `Hello ${user.name},\n\nYour verification code is: ${otpCode}\n\nThis code is valid for 10 minutes. Please enter it to complete your registration.`,
      userId: user.id
    }).catch(err => console.error('Verification email failed:', err.message));

    res.status(200).json({
      success: true,
      message: 'Verification OTP has been sent to your email.'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  verifyOtp,
  sendOtp
};
