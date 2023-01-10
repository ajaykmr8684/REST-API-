import express from "express"
const router = express.Router();
import { loginController, registerController, userController, refreshController } from "../controllers";
import auth from "../middlewares/auth"


router.post("/register", registerController.register)
router.post("/login", loginController.login)
router.get("/me", auth, userController.me)
router.get("/refresh", refreshController.refresh)




export default router;