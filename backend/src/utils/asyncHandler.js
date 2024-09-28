import { ApiResponse } from "./apiResponse.js";

const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise.resolve(reqHandler(req, res, next)).catch((error)=> res.status(error?.statusCode).json(new ApiResponse(error?.statusCode, {}, error?.message)));
    }
};




// // one approach to do this
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
            // await fn(req, res, next);
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// };

export { asyncHandler };