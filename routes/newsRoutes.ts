import express from "express";
import { isLoggedIn, protect } from "../controllers/authController";
const newsController = require("../controllers/newsController");
const router = express.Router();

router.use(isLoggedIn);
router.use(protect);
router.route("/:search").get(newsController.getSearchNews);

export default router;
