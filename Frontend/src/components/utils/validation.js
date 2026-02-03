// src/utils/validation.js

// A function that validates if the input contains only numbers for Aadhar
export const validateAadhar = (value) => {
    return /^[0-9]*$/.test(value); // Allow only numbers
};

// A function that validates if the input contains only numbers for phone numbers
export const validatePhoneNumber = (value) => {
    return /^[0-9]{10}$/.test(value); // Allow only numbers
};


// A function that validates if the input is a valid email format
export const validateEmail = (value) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
};

// A function that validates if the input contains only letters and numbers (no spaces or special characters)
export const validateAlphanumeric = (value) => {
    return /^[a-zA-Z0-9]+$/.test(value);  // Allow only letters and numbers
};

// A function that validates if the input contains only letters and spaces (no numbers or special characters)
export const validateOnlyLetters = (value) => {
    return /^[A-Za-z\s]+$/.test(value); // Only letters and spaces allowed
  };
  
