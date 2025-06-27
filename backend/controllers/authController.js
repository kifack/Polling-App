const User = require("../models/User");
const Poll = require("../models/Poll");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "5d" });
};

// Register user
exports.registerUser = async (req, res) => {
  let { fullName, username, email, password, profileImageUrl } = req.body;

  // Validation
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const usernameRegex = /^[a-zA-Z0-9-]+$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({
      message:
        "Invalid username.Only alphanumeric characters and hyphens are allowed,non spaces are permitted",
    });
  }

  try {
    // Check email already used
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email  already in use" });
    }

    existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username  already in use" });
    }

    // if (!profileImageUrl) {
    //   profileImageUrl = `${req.protocol}://${req.host}/uploads/user.jpg`;
    // }

    const user = await User.create({
      fullName,
      username,
      email,
      password,
      profileImageUrl,
    });
    delete user.password;
    return res.status(201).json({
      id: user._id,
      user: {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    let userPollsInfo = await getUserPollCount(user);
    return res.status(201).json({
      id: user._id,
      user: {
        fullName: user.fullName,
        email: user.email,
        username: user.username,
        profileImageUrl: user.profileImageUrl,
        ...userPollsInfo,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error signing user", error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let userPollsInfo = await getUserPollCount(user);
    const userInfo = {
      ...user.toObject(),
      ...userPollsInfo,
    };

    return res.status(200).json(userInfo);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error getting  user's info", error: error.message });
  }
};

async function getUserPollCount(user) {
  // Count polls created by the user
  const totalPollsCreated = await Poll.countDocuments({ creator: user._id });

  // Count user has voted
  const totalPollsVotes = await Poll.countDocuments({ voters: user._id });

  // Get count of bookmarked polls
  const totalPollsBookmarked = user.bookmarkedPolls.length;

  return { totalPollsCreated, totalPollsVotes, totalPollsBookmarked };
}
