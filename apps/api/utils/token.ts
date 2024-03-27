import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

type User = {
  username: string;
  email: string;
  firstname?: string;
  lastname?: string;
};

const createAccessToken = (user: User) => {
  return jwt.sign(
    {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    process.env.JWT_SECRET as Secret,
    { expiresIn: "15m" }
  );
};

const createRefreshToken = (user: User) => {
  return jwt.sign(
    {
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname,
    },
    process.env.JWT_Refresh_SECRET as Secret,
    { expiresIn: "7d" }
  );
};

const setTokens = (
  res: Response,
  refreshToken: string,
  accessToken: string
) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
  });
};

export { createAccessToken, createRefreshToken, setTokens };
