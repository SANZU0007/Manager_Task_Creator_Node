import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

// @desc Register a new user
// @route POST /api/users/register
const registerUser = async (req, res) => {
  const { username, email, password, role } = req.body; // Include role in the destructuring

  // Check if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Validate the role (optional: ensure it's either 'normal' or 'admin')
  if (!['normal', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role provided' });
  }

  // Create new user
  const user = await User.create({
    username,
    email,
    password,
    role, // Use the role from the request body
  });

  if (user) {
    res.status(201).json({
      message: 'User created successfully',
     
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc Login user
// @route POST /api/users/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role),
    });
  } else {
    res.status(400).json({ message: 'Invalid email or password' });
  }
};

// Generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
const getAllUsers = async (req, res) => {
  try {
    // Fetch only username and id, excluding users with admin role
    const users = await User.find({ role: 'normal' }).select('username _id'); 
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};




export { registerUser, loginUser ,getAllUsers };
