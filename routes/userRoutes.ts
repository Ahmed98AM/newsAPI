import express from "express";
const userController = require("../controllers/userController");
import {
  isLoggedIn,
  protect,
  login,
  signUp,
} from "../controllers/authController";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.use(isLoggedIn);
router.use(protect);
router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
