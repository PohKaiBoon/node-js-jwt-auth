const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const { QueryTypes } = require("sequelize");

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { Sequelize, user, sequelize } = require("../models");

exports.signup = (req, res) => {
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
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  let matchedTeachers = [];

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
      user.getRoles().then(async (roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        if (authorities[0] === "ROLE_STUDENT") {
          matchedTeachers = await filtering(user);
          console.log(matchedTeachers);
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
          matchedTeachers: matchedTeachers,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

async function filtering(user) {
  var matchedTeacher = [];
  const teachers = await sequelize.query(
    "SELECT id,name,contactNumber, gender, highestQualification, hourly, modeTeaching, subjectPreferences FROM findcher.users JOIN user_roles ON users.id=user_roles.userId WHERE roleId=2",
    {
      type: QueryTypes.SELECT,
    }
  );

  console.log(teachers.length);

  if (teachers.length == 0) {
    return "No teachers available at the moment!";
  }

  let currentStudent = JSON.parse(JSON.stringify(user));

  for (let index = 0; index < teachers.length; index++) {
    console.log("Teacher Start" + index.toString());

    var match = 0;

    if (currentStudent.preferredGender === teachers[index].gender) {
      console.log("gender is a match");
      match++;
    }
    if (currentStudent.hourly <= teachers[index].hourly) {
      console.log("hourly is a match");
      match++;
    }
    var subjectArrayTeachers = teachers[index].subjectPreferences.split(", ");
    var subjectArrayStudent = currentStudent.subjectPreferences.split(", ");

    subjectArrayStudent.forEach((element) => {
      if (subjectArrayTeachers.includes(element)) {
        match++;
        console.log(element + "Matched!");
      }
    });

    console.log(match);
    if (match >= 2) {
      matchedTeacher.push(teachers[index]);
    }

    console.log("Teacher End" + index.toString());
  }

  return matchedTeacher;
}
