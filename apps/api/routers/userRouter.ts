import express from "express";
import {
  login,
  register,
  updatePassword,
  updateUser,
} from "../controllers/user";
import { zodParser } from "../middlewares/zodParser";
import verifyToken from "../middlewares/verifyToken";
import {
  userLoginSchema,
  userRegistrationSchema,
  userUpdatePasswordSchema,
  userUpdateSchema,
} from "../schemas/userSchemas";

const UserRouter = express.Router();

UserRouter.post("/auth/register", zodParser(userRegistrationSchema), register);
UserRouter.post("/auth/login", zodParser(userLoginSchema), login);
UserRouter.patch(
  "/user/update",
  zodParser(userUpdateSchema),
  verifyToken,
  updateUser
);
UserRouter.patch(
  "/user/update-password",
  zodParser(userUpdatePasswordSchema),
  verifyToken,
  updatePassword
);

export default UserRouter;
