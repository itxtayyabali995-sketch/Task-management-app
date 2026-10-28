
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { fullname, fullName, email, password, contact, phone } = req.body;

    const name = (fullname || fullName || "").trim();
    const userEmail = (email || "").trim().toLowerCase();
    const userContact = contact || phone || "";

    if (!name || !userEmail || !password || !userContact) {
      return res.status(400).json({
        message: "Please fill all required fields.",
        success: false,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a profile photo.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email: userEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilePic = `/uploads/${req.file.filename}`;

    const user = await User.create({
      fullname: name,
      email: userEmail,
      password: hashedPassword,
      contact: userContact,
      file: profilePic,
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
        contact: user.contact,
        file: user.file,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Registration failed.",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const email = (req.body.email || "").trim().toLowerCase();
    const { password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide email and password.",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_KEY || "mysecretkey",
      { expiresIn: "1d" }
    );

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          contact: user.contact,
          file: user.file,
        },
        token,
        success: true,
      });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error during login.",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  return res
    .status(200)
    .clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })
    .json({
      message: "Logged out successfully.",
      success: true,
    });
};
