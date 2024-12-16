const express = require("express");
const userSchema = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Verify Token Route
router.get("/token", async (req, res) => {
  try {
    let token = req.headers.authorization;

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: "No token provided",
      });
    }

    // Remove "Bearer " prefix from the token if present
    token = token.split(" ")[1];

    // Verify the token
    jwt.verify(token, "qwerty123456", async (err, decoded) => {
      if (err) {
        return res.status(403).json({
          isSuccess: false,
          message: "Invalid token",
        });
      }

      // Token is valid; fetch the data
      const result = await userSchema.find({});
      return res.status(200).json({
        isSuccess: true,
        data: result,
      });
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).json({
      isSuccess: false,
      message: "Internal server error",
    });
  }
});

// Sign Up Route
router.post("/signUp", async (req, res) => {
  try {
    const body = req.body;

    if (!body.email) {
      return res.status(400).json({
        isSuccess: false,
        error: "Email is missing",
      });
    }
    if (!body.password) {
      return res.status(400).json({
        isSuccess: false,
        error: "Password is missing",
      });
    }

    const existingUser = await userSchema.findOne({ email: body.email });
    if (existingUser) {
      return res.status(400).json({
        isSuccess: false,
        error: "User with this email already exists",
      });
    } else {
      const hashedPassword = await bcrypt.hash(body.password, 10);

      const obj = {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      };
      const Modelobj = new userSchema(obj);
      await Modelobj.save();

      return res.status(201).json({
        isSuccess: true,
        message: "User created successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const body = req.body;

    if (!body.email) {
      return res.status(400).json({
        isSuccess: false,
        error: "Email is missing",
      });
    }
    if (!body.password) {
      return res.status(400).json({
        isSuccess: false,
        error: "Password is missing",
      });
    }

    const existingUser = await userSchema.findOne({ email: body.email });
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(body.password, existingUser.password);
      if (passwordMatch) {
        const token = jwt.sign({ ...existingUser.toObject() }, "qwerty123456", {
          expiresIn: "2min",
        });

        return res.status(200).json({
          isSuccess: true,
          message: "User login successful",
          data: {
            user: existingUser,
            token: token,
          },
        });
      } else {
        return res.status(400).json({
          isSuccess: false,
          error: "Password does not match",
        });
      }
    } else {
      return res.status(404).json({
        isSuccess: false,
        error: "User not found with this email",
      });
    }
  } catch (error) {
    return res.status(500).json({
      isSuccess: false,
      message: error.message,
    });
  }
});

module.exports = router;
