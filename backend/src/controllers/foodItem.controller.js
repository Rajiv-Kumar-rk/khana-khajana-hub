import { FoodItem } from "../models/foodItem.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils//apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addFoodItem = asyncHandler(async (req, res, next) => {
    try {
        

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Food item added successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while adding the food item.");
    }
});



const updateFoodItem = asyncHandler(async (req, res, next) => {
    try {
        

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Food item updated successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while updating the food item.");
    }
});

const removeFoodItem = asyncHandler(async (req, res, next) => {
    try {
        const itemId = req.params.foodItemId;

        if(!itemId) throw new ApiError(400, "Food item id is required.");
        
        const isFoodItemExist = await FoodItem.findById(itemId);

        if(!isFoodItemExist) throw new ApiError(404, "Food item with requested id doesn't exist.");

        await FoodItem.findByIdAndDelete(itemId);

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Food item deleted successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while deleting the food item.");
    }
});

const getFoodItemsList = asyncHandler(async (req, res, next) => {
    try {
        const foodItems = await FoodItem.find({});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            foodItems,
            "Food items list fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while fetching the food items list.");
    }
});

const getFoodItemDetails = asyncHandler(async (req, res, next) => {
    try {
        console.log("params: ", rq.params);
        const itemId = req.params.foodItemId;

        if(!itemId) throw new ApiError(400, "Food item id is required.");

        const foodItem = await FoodItem.findById(itemId);

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            foodItem,
            "Food item deatils fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while fetching the food item details.");
    }
});

export {
    addFoodItem,
    removeFoodItem,
    updateFoodItem,
    getFoodItemsList,
    getFoodItemDetails
}
