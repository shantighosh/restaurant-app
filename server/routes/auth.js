import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// 1. REGISTER ACCOUNT NODE
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN NODE (Fixed to send nested user object for Login.jsx compatibility)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // 🌟 FIXED: Wrapped name and role inside a "user" object so frontend parses it seamlessly
    res.json({ 
      token, 
      user: {
        name: user.name,
        role: user.role,
        email: user.email
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CURRENT USER STATUS HYDRATION NODE (Patches the 404 Error on refresh)
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No authorization session token found.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Pull user record from database without leaking password security strings
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User profile record missing.' });

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Session expired or token authentication failed.' });
  }
});

export default router;