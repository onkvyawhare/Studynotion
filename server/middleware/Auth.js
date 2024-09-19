const jwt = require("jsonwebtoken");

const User = require("../models/User");
// Configuring dotenv to load environment variables from .env file


// This function is used as middleware to authenticate user requests


// Auth middleware



exports.auth = async (req, res, next) => {
  try {
    // Extract token from cookies, body, or headers
    const token = req.cookies.token 
                  || req.body.token 
                  || (req.header("Authorization") ? req.header("Authorization").replace("Bearer ", "").trim() : "");

    // If token is missing, return an error response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    // Verify the token
    try {
    //   console.log('Token:', token);
    //   console.log('Secret:', process.env.JWT_SECRET);

      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decode);
      req.user = decode;
    } catch (err) {
      console.error('Token verification error:', err.message);
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }

    next();
  } catch (err) {
    // Unexpected error
    console.error('Unexpected error during token validation:', err.message);
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