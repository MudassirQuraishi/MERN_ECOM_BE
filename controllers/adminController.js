const { v4: uuidv4 } = require("uuid");
const Product = require("../models/productModel");
const { addProductValidation } = require("../services/reqBodyValidations");
const Logger = require("../services/logger");
const addProduct = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        function_name: "addProduct",
        message: "Entered Function",
    });
    try {
        const { error, value } = addProductValidation.validate(req.body);
        if (error) {
            Logger.log("error", {
                code: "BAD_REQUEST",
                message: "API validation failed",
                function_name: "addProduct",
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
        const {
            name,
            category,
            originalPrice,
            discountedPrice,
            mainImage,
            sideImages,
            tags,
        } = value;
        const product = await Product.create({
            name: name,
            category: category,
            originalPrice: originalPrice,
            discountedPrice: discountedPrice,
            mainImage: mainImage,
            sideImages: sideImages,
            tags: tags,
        });
        Logger.log("info", {
            code: "CREATED",
            message: "Product added  successfully",
            uuid: uuid,
            function_name: "addProduct",
        });
        return res.status(201).json({
            code: "CREATED",
            message: "Product added successfully",
        });
    } catch (error) {
        Logger.log("error", {
            code: error.name,
            message: "Error while signing up user",
            reason: error.message,
            uuid: uuid,
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
module.exports = { addProduct };
