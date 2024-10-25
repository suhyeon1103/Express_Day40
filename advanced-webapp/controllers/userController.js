const User = require("../models/User");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).send("사용자를 찾을 수 없습니다.");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
};
