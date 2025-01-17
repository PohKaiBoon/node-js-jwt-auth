module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      username: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      contactNumber: {
        type: Sequelize.INTEGER,
      },
      address: {
        type: Sequelize.STRING,
      },
      birthday: {
        type: Sequelize.DATEONLY,
      },
      gender: {
        type: Sequelize.STRING,
      },
      highestQualification: {
        type: Sequelize.STRING,
      },
      hourly: {
        type: Sequelize.INTEGER,
      },
      modeTeaching: {
        type: Sequelize.STRING,
      },
      preferredGender: {
        type: Sequelize.STRING,
      },
      subjectPreferences: {
        type: Sequelize.STRING,
      },
    });
  
    return User;
  };
  