import express from "express"
const router = express.Router();
import { loginController, registerController, userController, refreshController, productController } from "../controllers";
import auth from "../middlewares/auth"


router.post("/register", registerController.register)
router.post("/login", loginController.login)
router.get("/me", auth, userController.me)
router.post("/refresh", refreshController.refresh)
router.post("/logout", auth, loginController.logout)

//Products
router.post("/products", productController.store)




export default router;