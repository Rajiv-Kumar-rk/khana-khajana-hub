import { asyncHandler } from "../utils/asyncHandler.js";
import { FoodItem } from "../models/foodItem.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const addItemToWishlist = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.itemId) throw new ApiError(400, "'itemId' is required.");

        const isItemExists = await FoodItem.exists({_id: reqBody.itemId});
        if(!isItemExists) throw new ApiError(400, "Requested 'itemId' doesn't exists.");

        const user = await User.findById(req.user?._id);
        let userWishlist = {...user.wishlist};

        if(!(reqBody.itemId in userWishlist)) userWishlist[reqBody.itemId] = true;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    wishlist: userWishlist
                }
            },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Item added successfully to wishlist."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while adding item to wishlist.");
    }
});

const removeItemFromWishlist = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.itemId) throw new ApiError(400, "'itemId' is required.");

        const user = await User.findById(req.user?._id);
        let userWishlist = {...user.wishlist};

        if(!(reqBody.itemId in userWishlist)) throw new ApiError(400, "Wishlist doesn't contains item with the requested 'itemId'.");
        else delete userWishlist[reqBody.itemId];
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    wishlist: userWishlist
                }
            },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Item removed successfully from the wishlist."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while removing the item from the wishlist.");
    }
});

const getWishlistDetails = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            user.wishlist,
            "Wishlist details fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while fetching the wishlist.");
    }
});

export {
    addItemToWishlist,
    removeItemFromWishlist,
    getWishlistDetails
}