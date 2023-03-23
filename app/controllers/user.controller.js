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

exports.userBoard = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).render("userBoard", { users });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message || "Error occurred while retrieving users",
    });
  }
};
exports.editProfile = (req, res) => {
  const {
    id,
    name,
    contactNumber,
    address,
    highestQualification,
    modeTeaching,
    preferredGender,
    subjectPreferences,
    hourly,
  } = req.body;

  User.update(
    {
      name,
      contactNumber,
      address,
      highestQualification,
      modeTeaching,
      preferredGender,
      subjectPreferences,
      hourly,
    },
    {
      where: {
        id: id,
      },
    }
  )
    .then((num) => {
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
