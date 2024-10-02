import { asyncHandler } from "../utils/asyncHandler.js";
import { FoodItem } from "../models/foodItem.model.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

const addItemToCart = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.itemId) throw new ApiError(400, "'itemId' is required.");

        const isItemExists = await FoodItem.exists({_id: reqBody.itemId});
        if(!isItemExists) throw new ApiError(400, "Requested 'itemId' doesn't exists.");

        const user = await User.findById(req.user?._id);
        let userCart = {...user.cart};

        if(!(reqBody.itemId in userCart)) userCart[reqBody.itemId] = 1;
        else userCart[reqBody.itemId] += 1;
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    cart: userCart
                }
            },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Item added successfully to cart."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while adding item to cart.");
    }
});

const decrementItemCountFromCart = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.itemId) throw new ApiError(400, "'itemId' is required.");

        const user = await User.findById(req.user?._id);
        let userCart = {...user.cart};

        if(!(reqBody.itemId in userCart)) throw new ApiError(400, "Cart doesn't contains item with the requested 'itemId'.");
        else {
            if(userCart[reqBody.itemId] > 1) userCart[reqBody.itemId] -= 1;
            else delete userCart[reqBody.itemId];
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    cart: userCart
                }
            },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Item count decremented successfully from the cart."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while decrementing the item count from the cart.");
    }
});

const removeItemFromCart = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.itemId) throw new ApiError(400, "'itemId' is required.");

        const user = await User.findById(req.user?._id);
        let userCart = {...user.cart};

        if(!(reqBody.itemId in userCart)) throw new ApiError(400, "Cart doesn't contains item with the requested 'itemId'.");
        else delete userCart[reqBody.itemId];
        
        const updatedUser = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    cart: userCart
                }
            },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Item removed successfully from the cart."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while removing the item from the cart.");
    }
});

const getCartDetails = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findById(req.user?._id);

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            user.cart,
            "Cart details fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while fetching the cart.");
    }
});

export {
    addItemToCart,
    decrementItemCountFromCart,
    removeItemFromCart,
    getCartDetails
}