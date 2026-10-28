import express from "express";
import { register, login } from "../controller/user.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", singleUpload, register);
router.post("/login", login);

export default router;