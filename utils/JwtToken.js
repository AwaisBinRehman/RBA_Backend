// Create Token and saving in cookie
const User = require('../models/user');

const sendToken = async (user, statusCode, res) => {
  try {
    // Fetch the user's data including the role from the database using the user's ID
    const fetchedUser = await User.findById(user._id); // Assuming _id is the user's ID field

    if (!fetchedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Generate the JWT token with the fetched role and other user data
    const token = fetchedUser.generateJwtToken();

    // Options for cookie
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      token,
      user: {
        _id: fetchedUser._id,
        applicant_Name: fetchedUser.applicant_Name,
        email: fetchedUser.email,
        role: fetchedUser.role,
      },
    });
  } catch (error) {
    // Handle any errors that occur during fetching the user or token generation
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

module.exports = sendToken;


module.exports = sendToken;


module.exports = sendToken;



