import { register, login, dashboard, allUsers } from "../controllers/User.js";
import { validateToken } from "../middlewares/validateToken.js";
import express from "express";
const AuthRouter = express.Router();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);
AuthRouter.get("/dashboard", validateToken, dashboard);
AuthRouter.get("/all-users", validateToken, allUsers);
export { AuthRouter };
