const { v4: uuidv4 } = require("uuid");
const Logger = require("../services/logger");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

const fetchUserDetails = async (req, res) => {
    const uuid = uuidv4();
    Logger.log("info", {
        uuid: uuid,
        user: req.user._id,
        function_name: "fetchUserDetails",
        message: "Entered Function",
    });
    try {
        if (req.user !== undefined) {
            Logger.log("info", {
                code: "OK",
                message: "User-data fetchd successfully",
                uuid: uuid,
                user: req.user._id,
                function_name: "fetchUserDetails",
            });
            return res.status(200).json({
                code: "OK",
                message: "User-data fetchd successfully",
                USER_DATA: req.user,
            });
        }
    } catch (error) {
        console.log(error);
    }
};
const fetchProducts = async (req, res) => {
    const { category } = req.params;
    const products = await Product.find({ category: category });
    return res.status(200).json({ success: true, productsData: products });
};
const fetchProduct = async (req, res) => {
    const { prodId } = req.params;
    const product = await Product.find({ _id: prodId });
    return res.status(200).json({ success: true, productData: product[0] });
};
const addToCart = async (req, res) => {
    try {
        const { id: productId } = req.query;
        const { _id: userId } = req.user;

        const userCart = await Cart.findOne({ user: userId });
        const productDetails = await Product.findById(productId);

        if (userCart) {
            const existingProductIndex = userCart.products.findIndex(
                (product) => product.product.equals(productId)
            );

            if (existingProductIndex !== -1) {
                userCart.products[existingProductIndex].quantity += 1;
                userCart.products[existingProductIndex].totalPrice +=
                    productDetails.discountedPrice;
            } else {
                if (productDetails) {
                    userCart.products.push({
                        product: productId,
                        quantity: 1,
                        totalPrice: productDetails.discountedPrice,
                    });
                }
            }

            await userCart.save();
        } else {
            if (productDetails) {
                await Cart.create({
                    user: userId,
                    products: [
                        {
                            product: productId,
                            quantity: 1,
                            totalPrice: productDetails.discountedPrice,
                        },
                    ],
                });
            }
        }
        const updatedCart = await Cart.findOne({ user: userId }).populate(
            "products.product"
        );
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
};

const fetchCart = async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const cart = await Cart.findOne({ user: userId });
        const updatedCart = await Cart.findOne({ user: userId }).populate(
            "products.product"
        );
        res.status(200).json({ success: true, cart: updatedCart });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    fetchUserDetails,
    fetchProducts,
    fetchProduct,
    addToCart,
    fetchCart,
};
