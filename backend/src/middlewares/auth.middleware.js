import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authMiddleware = asyncHandler( async (req, res, next) => {
    try {
        // get the access token either form req cookie or req header
        const accessToken = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!accessToken) throw new ApiError(401, "Unauthorized Request.");

        // jwt verify to get the decoded token info
        const decodedTokenInfo = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        // get the user from db
        const user = await User.findById(decodedTokenInfo?._id).select("-password");

        if(!user) throw new ApiError(400, "Invalid access token.");

        // Check if the refresh token is present in the database (indicates whether the user is still logged in)
        if (!user.refreshToken) throw new ApiError(401, "Session expired or user logged out.");
    

        // user data to expose with req
        const userData = {
            "_id": user._id, 
            firstName: user.firstName, 
            lastName: user.lastName,
            email: user.email
        };

        // attach the user to req
        req.user = userData;
        next();
    } catch (err) {
        console.log(err)
        throw new ApiError(401, err?.message || "Invalid access token.");
    }
});
