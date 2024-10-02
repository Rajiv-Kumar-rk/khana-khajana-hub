import { FoodItem } from "../models/foodItem.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils//apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addFoodItem = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.name && !reqBody.description && !reqBody.price && !reqBody.categoryId) throw new ApiError(400, "Invalid request.");

        if(!req.file?.path) throw new ApiError(400, "Food item image is required.");

        const uploadedCloudinaryImageRes = await uploadOnCloudinary(req.file?.path);

        const foodItem = await FoodItem.create({
            name: reqBody.name.trim(),
            description: reqBody.description.trim(),
            price: Number(reqBody.price),
            category: reqBody.categoryId,
            image: uploadedCloudinaryImageRes?.url
        });

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            foodItem,
            "Food item added successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while adding the food item.");
    }
});

const updateFoodItem = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.foodItemId) throw new ApiError(400, "'foodItemId' is required.");

        if(!reqBody.name && !reqBody.description && !reqBody.price && !reqBody.categoryId) throw new ApiError(400, "Invalid request.");

        if(!req.file?.path) throw new ApiError(400, "Food item image is required.");
        const uploadedCloudinaryImageRes = await uploadOnCloudinary(req.file?.path);

        const isItemExist = await FoodItem.findById(reqBody.foodItemId);

        if(!isItemExist) throw new ApiError(404, "Food item with request id doesn't exist.");

        const updatedFoodItem = await FoodItem.findByIdAndUpdate(
            reqBody.foodItemId,
            {
                $set: {
                    name: reqBody.name,
                    description: reqBody.description,
                    price: reqBody.price,
                    category: reqBody.categoryId,
                    image: uploadedCloudinaryImageRes?.url
                }
            },
            { new: true }
        );

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedFoodItem,
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
