const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!gender || !age) {
    throw new Error("Gender or Age is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak");
  }
};

module.exports = {
  validateSignupData,
};
