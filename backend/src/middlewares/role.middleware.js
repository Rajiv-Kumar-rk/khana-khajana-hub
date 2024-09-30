import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const roleMiddleware = (allowedRoles) => asyncHandler(async (req, res, next) => {
    try {
        const loggedUserRole = req.user?.role;

        if(!loggedUserRole) throw new ApiError(400, "User found with not assigned any role.");

        if(!allowedRoles.includes(loggedUserRole)) throw new ApiError(403, "Not authorized to perform this action.");
        next();
    } catch(err) {
        console.log(err)
        throw new ApiError(err?.statusCode, err?.message || "Something went wrong while extracting the user role.");
    }
});