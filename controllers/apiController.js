const { v4: uuidv4 } = require("uuid");
const Logger = require("../services/logger");

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
module.exports = {
    fetchUserDetails,
};
