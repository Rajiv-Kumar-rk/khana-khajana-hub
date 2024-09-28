import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserRequestValidator } from "../utils/validator/userValidators.js";
import { ApiError } from "../utils//apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
    if(!userId) return new ApiError(400, "User account doesn't exist.");
    try {
        const user = await User.findById(userId);
        
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});

        return { accessToken, refreshToken };

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating the user tokens.");
    }
};

const registerUser = asyncHandler( async (req, res, next) => {
    // fetch req body
    const reqBody = req.body;

    // validate the req body data
    if(!registerUserRequestValidator(reqBody)) throw new ApiError(400, "Invalid request.");

    // check if the user already exist
    const isUserExist = await User.findOne({
        $or: [{ email: reqBody.email }]
    });

    if (isUserExist) throw new ApiError(400, "User with provided email already exist.");

    // get the file path 
    const profileImageLocalPath = req.file?.path;

    if (!profileImageLocalPath) throw new ApiError(400, "Profile image is required.");

    // upload the file on cloudinary
    const cloudinaryResponse = await uploadOnCloudinary(profileImageLocalPath);

    if (cloudinaryResponse === null) throw new ApiError(500, "Someting went wrong while registering the user.");

    // save user
    const user = await User.create({
        firstName: reqBody.firstName,
        lastName: reqBody.lastName,
        email: reqBody.email.toLowerCase(),
        avatar: cloudinaryResponse?.url,
        password: reqBody.password
    })

    // cross -check for the user creation
    const userToExpose = await User.findById(user._id).select("-password -refreshToken");

    if (!userToExpose) throw new ApiError(500, "Someting went wrong while registering the user.");

    return res.status(200).json(
        new ApiResponse(200, userToExpose, "User registered successfully.")
    );
});

const loginUser = asyncHandler( async (req, res, next) => {
    try {
        // collect user data from req body
        const reqBody = req.body;

        // check if the user exist
        const user = await User.findOne({
            $or: [{ email: reqBody.email }]
        });

        if (!user) throw new ApiError(400, "User account doesn't exist.");

        // validate the provided user password
        const isPasswordCorrect = await user.isPasswordCorrect(reqBody.password);

        if(!isPasswordCorrect) throw new ApiError(400, "Invalid user credentials.");

        // generate the tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        // attach the token to user req cookiee
        const options = { // only readable from frontend side
            httpOnly: true,
            secure: true
        }

        // fetch user with restricted data
        const loggedUser = await User.findById(user._id).select("-password -refreshToken");

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedUser,
                    accessToken,
                    refreshToken
                },
                "User logged In successfully."
            ));
    } catch (err) {
        console.log(err)
        throw new ApiError(500, "Something went wrong while login the user.");
    }
});

const logoutUser = asyncHandler(async (req, res, next) => {
    // dettach the refreshToken from user 
    const updatedUser = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User Logged Out successfully."
            )
        );
});


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request.");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
    
        const user = await User.findById(decodedToken?._id);
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token.");
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used.");
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        };
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                { accessToken, refreshToken: newRefreshToken },
                "Access token refreshed."
            )
        );
    } catch (error) {
        // console.log(error);
        throw new ApiError(401, "Invalid refresh token.");
    }

});

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
};