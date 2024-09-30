import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils//apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Category } from "../models/category.model.js";

const addCategory = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.name) throw new ApiError(400, "'name' is required.");

        const category = await Category.create({name: reqBody.name.trim()});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            category,
            "Category added successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while adding the category.");
    }
});

const updateCategory = asyncHandler(async (req, res, next) => {
    try {
        const reqBody = req.body;

        if(!reqBody.categoryId) throw new ApiError(400, "'categoryId' is required.");
        if(!reqBody.name) throw new ApiError(400, "'name' is required.");

        const updatedCategory = await Category.findByIdAndUpdate(
            reqBody.categoryId,
            {
                $set: {
                    name: reqBody.name
                }
            },
            { new:true }
        );

        if(!updatedCategory) throw new ApiError(404, "Category wiht requested id doesn't exist.");

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            updatedCategory,
            "Category updated successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while updating the category.");
    }
});

const removeCategory = asyncHandler(async (req, res, next) => {
    try {
        const id = req.params.categoryId;

        if(!id) throw new ApiError(400, "Category id is required.");

        const isCategoryExist = await Category.findById(id);
        if(!isCategoryExist) throw new ApiError(404, "Category with request id doesn't exist.");

        await Category.findByIdAndDelete(id);

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Category removed successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while removing the category.");
    }
});

const getCategoriesList = asyncHandler(async (req, res, next) => {
    try {
        const categoriesList = await Category.find({});

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            categoriesList,
            "Categories list fetched successfully."
        ));
    } catch(err) {
        throw new ApiError(err.statusCode? err.statusCode:500, err.message? err.message:"Something went wrong while fetching the categories list.");
    }
});

export {
    addCategory,
    updateCategory,
    removeCategory,
    getCategoriesList
}