const Joi = require("joi");
/**
 * Joi schema for validating signup credentials.
 */
const signupValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
    password: Joi.string().min(8).required(),
});
/**
 * Joi schema for validating login credentials.
 */
const loginValidation = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
    password: Joi.string().min(8).required(),
});
/**
 * Joi schema for validating reset password body.
 */
const resetPasswordValidation = Joi.object({
    oldPassword: Joi.string().min(8).required(),
    newPassword: Joi.string().min(8).required(),
});
module.exports = {
    signupValidation,
    loginValidation,
    resetPasswordValidation,
};
