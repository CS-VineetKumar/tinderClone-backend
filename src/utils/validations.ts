import validator from 'validator';
import { Request } from 'express';

const validateSignupData = (req: Request): void => {
  const { firstName, lastName, email, password, month, date, year, gender, interest, lookingFor } = req.body.formfields;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is invalid");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is weak");
  }
  if (!date || !month || !year) {
    throw new Error("Date of birth is not valid");
  };
  if (!gender) {
    throw new Error("Gender is required");
  }
  if (!interest) {
    throw new Error("Interest is required");
  }
  if (!lookingFor) {
    throw new Error("LookingFor is required");
  }
};

const validateEditProfileData = (req: Request): boolean => {
  const ALLOWED_UPDATES = [
    "firstName",
    "lastName",
    "gender",
    "month",
    "date",
    "year",
    "interest",
    // "photo",
    "lookingfor",
  ];

  const isEditAllowed = Object.keys(req.body).every((fields) =>
    ALLOWED_UPDATES.includes(fields)
  );
  return isEditAllowed;
};

export {
  validateSignupData,
  validateEditProfileData,
}; 