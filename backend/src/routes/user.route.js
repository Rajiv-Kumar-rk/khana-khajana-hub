import { Router } from "express";
import { changeCurrentPasssword, changeUserRole, forgetPassword, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserProfileAvatar, updateUserProfileInfo } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { ApiResponse } from "../utils/apiResponse.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { ApiError } from "../utils/apiError.js";

const router = Router();

router.route("/register")
.post(upload.single("avatar"), registerUser
    // async (req, res, next) => {
    //     upload.single("avatar")(req, res, (err) => {
    //         if (err instanceof multer.MulterError) {
    //             // Multer-specific errors
    //             return res.status(400).json({ error: err.message });
    //         } else if (err) {
    //             // Other errors
    //             return res.status(500).json({ error: "An unknown error occurred during file upload" });
    //         }
            
    //     });
    //     registerUser(req, res, next);
    // ------------------------------------------
        // try {
        //     const file = await uploadSingleFile("avatr", req, res);  // Wait for file upload to complete
        //     console.log("f: ", file); 
        //     registerUser(req, res, next);  
        // } catch (error) {
        //     console.log("E: ", error)
        //     throw new ApiError(error.statusCode? error.statusCode : 500, error.message? error.message : "Something went wrong while saving the file to server.");
        // }
    // }
);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/forget-password").post(forgetPassword);

// secured routes
router.route("/logout").post(authMiddleware, logoutUser);
router.route("/change-password").post(authMiddleware, changeCurrentPasssword);
router.route("/getUser").get(authMiddleware, getUserProfile);
router.route("/updateUserDetails").post(authMiddleware, updateUserProfileInfo);
router.route("/updateUserProfile")
.post(
    authMiddleware, 
    (req, res, next) => {
        upload.single("avatar")(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Multer-specific errors
                return res.status(400).json({ error: err.message });
            } else if (err) {
                // Other errors
                return res.status(500).json({ error: "An unknown error occurred during file upload" });
            }
            updateUserProfileAvatar(req, res, next);
        });
    }
);
router.route("/changeUserRole").post(authMiddleware, roleMiddleware(["admin"]), changeUserRole);

export default router;