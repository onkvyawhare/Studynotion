const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file
dotenv.config();

// This function is used as middleware to authenticate user requests


// Auth middleware
exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or headers
    const token = req.cookies.token 
                  || req.body.token 
                  || req.header("Authorization")?.replace("Bearer ", "");
    
    // If token is missing, return an error response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }
    
    // Verify the token
    try {
      console.log("BEFORE VERIFYING");
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decode);
      console.log("HERE WE DECODED");
      req.user = decode;
    } catch (err) {
      // Token verification failed
      console.log(err);
      console.log(err.message);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
    
    next();
  } catch (err) {
    // Unexpected error
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

exports.isStudent = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Student") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Students",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
exports.isInstructor = async (req, res, next) => {
	try {
		const userDetails = await User.findOne({ email: req.user.email });
		console.log(userDetails);

		console.log(userDetails.accountType);

		if (userDetails.accountType !== "Instructor") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Instructor",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};