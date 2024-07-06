const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../verifyToken');

//  --------- REGISTER -----------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// ------------ LOGIN --------------
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("User not found!");
    }
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) {
      return res.status(401).json("Wrong Password");
    }

    const { _id, username, email } = user;
    const token = jwt.sign({ _id, username, email }, process.env.SECRET, { expiresIn: "3d" });

    // Ensure the secure flag is set correctly based on your environment
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
      sameSite: "Lax",
    }).status(200).json({ _id, username, email });
  } catch (err) {
    res.status(500).json(err);
  }
});

// -------------- LOGOUT ------------------
router.get('/logout', async (req, res) => {
  try {
    // Ensure the secure flag matches your environment
    res.clearCookie("token", {
      sameSite: "Lax",
      secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    }).status(200).send("User logged out successfully");
  } catch (err) {
    res.status(500).json(err);
  }
});

// --------------- REFETCH ----------------
router.get('/refetch', verifyToken, async (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.SECRET, {}, (err, data) => {
    if (err) {
      return res.status(401).json(err);
    }
    res.status(200).json(data);
  });
});

module.exports = router;

