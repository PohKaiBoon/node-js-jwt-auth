const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  if (req.body.roles && req.body.roles.indexOf("teacher") !== -1) {
    // Save User to Database
    User.create({
      username: req.body.username,
      name: req.body.name,
      address: req.body.address,
      highestQualification: req.body.highestQualification,
      birthday: req.body.birthday,
      hourly: req.body.hourly,
      contactNumber: req.body.contactNumber,
      modeTeaching: req.body.modeTeaching,
      gender: req.body.gender,
      preferredGender: req.body.preferredGender,
      subjectPreferences: req.body.subjectPreferences,
      password: bcrypt.hashSync(req.body.password, 8),
    })
      .then((user) => {
        // Set user roles as "teacher"
        Role.findOne({ where: { name: "teacher" } }).then((role) => {
          user.setRoles([role]).then(() => {
            res.send({ message: "Teacher registered successfully!" });
          });
        });
      })
      .catch((err) => {
        res.status(500).send({ message: err.message });
      });
  } else {
    // Ignore non-teacher users
    res.send({ message: "Student registered successfully!" });
  }
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Wrong username or password." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Wrong username or password.",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          name: user.name,
          highestQualification: user.highestQualification,
          address: user.address,
          birthday: user.birthday,
          hourly: user.hourly,
          modeTeaching: user.modeTeaching,
          gender: user.gender,
          preferredGender: user.preferredGender,
          contactNumber: user.contactNumber,
          subjectPreferences: user.subjectPreferences,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
