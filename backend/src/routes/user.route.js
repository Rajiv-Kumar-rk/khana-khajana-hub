import { Router } from "express";
import { changeCurrentPasssword, forgetPassword, getUserProfile, loginUser, logoutUser, refreshAccessToken, registerUser, updateUserProfileAvatar, updateUserProfileInfo } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import multer from "multer";

const router = Router();

router.route("/register")
.post(
    (req, res, next) => {
        upload.single("avatar")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Multer-specific errors
            return res.status(400).json({ error: err.message });
        } else if (err) {
            // Other errors
            return res.status(500).json({ error: "An unknown error occurred during file upload" });
        }
        registerUser(req, res, next);
        });
    }
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

export default router;