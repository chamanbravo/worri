import express from "express";
import {
  login,
  needSetup,
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

UserRouter.get("/users/setup", needSetup);
UserRouter.post("/users/register", zodParser(userRegistrationSchema), register);
UserRouter.post("/users/login", zodParser(userLoginSchema), login);
UserRouter.patch(
  "/users/update",
  zodParser(userUpdateSchema),
  verifyToken,
  updateUser
);
UserRouter.patch(
  "/users/update-password",
  zodParser(userUpdatePasswordSchema),
  verifyToken,
  updatePassword
);

export default UserRouter;
