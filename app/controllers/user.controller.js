exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.studentBoard = (req, res) => {
  res.status(200).send("Student Content.");
};

exports.teacherBoard = (req, res) => {
  res.status(200).send("Teacher Content.");
};

const db = require("../models");

const User = db.user;

exports.userBoard = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).render("userBoard", { users });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        message: err.message || "Error occurred while retrieving users",
      });
  }
};
