const UserModel = require("../Models/user");
exports.register = async (req, res) => {
  try {
    const { name, email, photoUrl } = req.body;
    const userExists = await UserModel.findOne({ email: email });
    if (!userExists) {
      let newUser = new UserModel({ name, email, photoUrl });
      await newUser.save();
      return res.status(200).json({
        message: "User registered",
        user: newUser,
      });
    }
    return res.status(200).json({
      message: "Welcome back",
      user: userExists,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};
