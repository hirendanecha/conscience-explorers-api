const userReality = require("../models/userReality.model");

exports.getMyReality = async function (req, res) {
  try {
    const id = req.params.id;
    const data = await userReality.getMyReality(id);
    res.send({ data });
  } catch (error) {
    return res.status(500).json({ message: "bad request" });
  }
};

exports.addEditReality = async function (req, res) {
  try {
    if (req.body) {
      const data = await userReality.addEditReality(req.body);
      res.send({ data });
    }
  } catch (error) {
    return res.status(500).json({ message: "bad request" });
  }
};
