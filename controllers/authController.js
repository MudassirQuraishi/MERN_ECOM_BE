const { v4: uuidv4 } = require("uuid");
const User = require("../models/userModel");
const { signToken } = require("../services/authService");
const {
    signupValidation,
    loginValidation,
    resetPasswordValidation,
} = require("../services/reqBodyValidations");
const Logger = require("../services/logger");

/**
 * Registers a new user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns a JSON response indicating successful user creation or an error message.
 */
const signupUser = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        user: req.body.email,
        function_name: "signupUser",
        message: "Entered Function",
    });
    try {
        const { error, value } = signupValidation.validate(req.body);
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "signupUser",
                reason: "Missing Inputs",
                uuid: uuid,
                user: value.userId,
                details: error.message,
            });
            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "Missing Credentials",
                details: error.message,
            });
        }
        const { username, email, password } = value;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            Logger.log("error", {
                code: "CONFLICT",
                message: "Existing user",
                function_name: "signupUser",
                reason: "User already exists",
                uuid: uuid,
                user: existingUser._id,
            });
            return res.status(409).json({
                error: "CONFLICT",
                message: `User ${username} already exists`,
            });
        }
        const user = new User({ username, email, password });
        await user.save();
        Logger.log("info", {
            code: "CREATED",
            message: "User created successfully",
            uuid: uuid,
            user: user._id,
            function_name: "signupUser",
        });
        return res.status(201).json({
            code: "CREATED",
            message: "User created successfully",
        });
    } catch (error) {
        Logger.log("error", {
            code: error.name,
            message: "Error while signing up user",
            reason: error.message,
            uuid: uuid,
            user: req.body.email,
        });
        return res.status(500).json({
            message: "User creation failed",
            reason: error.message,
            code: error.name,
        });
    } finally {
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "signupUser",
            message: "Exited Function",
        });
    }
};

/**
 * Logs in a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns a JSON response indicating successful user login or an error message.
 */
const loginUser = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        user: req.body.email,
        function_name: "loginUser",
        message: "Entered Function",
    });

    try {
        const { error, value } = loginValidation.validate(req.body);
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "loginUser",
                reason: "Missing Inputs",
                uuid: uuid,
                user: value.email,
                details: error.message,
            });
            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "Missing Credentials",
                details: error.message,
            });
        }
        const { email, password } = value;
        const user = await User.findOne({ email: email });
        if (!user) {
            Logger.log("error", {
                code: "NOT_FOUND",
                message: "User not found",
                function_name: "loginUser",
                reason: "No user data found in the database",
                uuid: uuid,
                user: email,
            });
            return res.status(404).json({
                code: "NOT_FOUND",
                success: false,
                message: "User Not Found",
            });
        }
        const passwordMatch = await user.comparePassword(password);
        if (!passwordMatch) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "Invalid password",
                function_name: "loginUser",
                uuid: uuid,
                user: user._id,
            });
            return res.status(400).json({
                code: "BAD_REQUEST",
                message: "Password Mismatch",
                success: false,
            });
        }
        const jwtToken = await signToken(email);
        Logger.log("info", {
            code: "OK",
            message: "User logged in successfully",
            uuid: uuid,
            user: user._id,
        });
        return res.status(200).json({
            code: "OK",
            message: "Logged in successfully",
            success: true,
            encryptedId: jwtToken,
            username: user.username,
        });
    } catch (error) {
        console.log(error);
        Logger.log("error", {
            code: error.name,
            message: "Error while Logging in",
            reason: error.message,
            uuid: uuid,
            user: req.body.email,
        });
        return res.status(500).json({
            message: "User log in failed",
            reason: error.message,
            code: error.name,
        });
    } finally {
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "loginUser",
            message: "Exited Function",
        });
    }
};
/**
 * Logs in a user.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object} - Returns a JSON response indicating successful user login or an error message.
 */
const resetPassword = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        function_name: "resetPassword",
        message: "Entered Function",
    });
    try {
        const { error, value } = resetPasswordValidation.validate(req.body);
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "resetPassword",
                reason: "Missing Inputs",
                uuid: uuid,
                details: error.message,
            });
            return res.status(400).json({
                error: "BAD_REQUEST",
                message: "Missing Credentials",
                details: error.message,
            });
        }
        const { oldPassword, newPassword } = value;
        const { email, _id } = req.user;
        const user = await User.findOne({ email: email });
        if (!user) {
            Logger.log("error", {
                code: "NOT_FOUND",
                message: "User not found",
                function_name: "resetPassword",
                reason: "No user data found in the database",
                uuid: uuid,
                user: _id,
            });
            return res.status(404).json({
                code: "NOT_FOUND",
                success: false,
                message: "User Not Found",
            });
        }
        const passwordMatch = await user.comparePassword(oldPassword);
        if (!passwordMatch) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "Incorrect Password",
                function_name: "resetPassword",
                uuid: uuid,
                user: _id,
            });
            return res.status(400).json({
                code: "BAD_REQUEST",
                message: "Password Mismatch",
                success: false,
            });
        }
        user.password = newPassword;
        await user.save();

        Logger.log("info", {
            code: "OK",
            message: "Password Changed Successfully",
            uuid: uuid,
            user: _id,
        });
        return res.status(200).json({
            code: "OK",
            message: "Password changed successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        Logger.log("error", {
            code: error.name,
            message: "Error updating password",
            reason: error.message,
            uuid: uuid,
            user: req.user._id,
        });
        return res.status(500).json({
            message: "Password Update Failed",
            reason: error.message,
            code: error.name,
        });
    } finally {
        Logger.log("info", {
            uuid: uuid,
            user: req.body.email,
            function_name: "resetPassword",
            message: "Exited Function",
        });
    }
};

module.exports = {
    signupUser,
    loginUser,
    resetPassword,
};
