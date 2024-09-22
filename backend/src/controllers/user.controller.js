import { asyncHandler } from "../utils/asyncHandler.js";
import { registerUserRequestValidator } from "../utils/validator/userValidators.js";
import { ApiError } from "../utils//apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler( async (req, res, next) => {
    // fetch req body
    const reqBody = req.body;

    // validate the req body data
    if(!registerUserRequestValidator(reqBody)) throw new ApiError(400, "Invalid request.");

    // check if the user already exist
    const isUserExist = await User.findOne({
        $or: [{ email }]
    });

    if (isUserExist) throw new ApiError(400, "User with provide email already exist.");

    // get the file path 
    const profileImageLocalPath = req.files?.avatar?.path;

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
    const userToExpose = await User.fiindById(user._id).select("-password -refreshToken");

    if (!userToExpose) throw new ApiError(500, "Someting went wrong while registering the user.");

    return res.status(200).json(
        new ApiResponse(200, userToExpose, "User registered successfully.")
    );
});

export { registerUser };