const db = require("../models");
const User = db.user;

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

exports.editProfile = (req, res) => {
  const { id, 
    name, 
    contactNumber, 
    address, 
    modeTeaching,
    subjectPreferences,
    hourly,
} = req.body;

  User.update(
    {
      name,
      contactNumber,
      address, 
      modeTeaching,
      subjectPreferences,
      hourly,
    },
    {
    where: {
      id: id
    }
  }).then((num) => {
    if (num == 1) {
      res.send({
        message: "Profile updated successfully.",
      });
    } else {
      res.status(400).send({
        message: "Failed to update profile.",
      });
    }
  })
  .catch((err) => {
    res.status(500).send({
      message: "Internal server error.",
    });
  });
};