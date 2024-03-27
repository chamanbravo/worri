import { Request, Response } from "express";
import { Users } from "../db/schema";
import db from "../db";
import logger from "../logger";
import { eq } from "drizzle-orm";
import { compare, hash } from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
  setTokens,
} from "../utils/token";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.username, username) || eq(Users.email, email));

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await hash(password, 10);
    await db
      .insert(Users)
      .values({ username, email, password: hashedPassword });

    const accessToken = createAccessToken({ username, email });
    const refreshToken = createRefreshToken({ username, email });

    setTokens(res, refreshToken, accessToken);

    return res.status(200).json({
      message: "User created successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await db.select().from(Users).where(eq(username, username));
    if (user.length === 0) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const accessToken = createAccessToken(user[0]);
    const refreshToken = createRefreshToken(user[0]);

    setTokens(res, refreshToken, accessToken);

    return res.status(200).json({
      message: "Login successful!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { firstname, lastname } = req.body;
  const { username } = res.locals.user;
  try {
    await db
      .update(Users)
      .set({ firstname, lastname })
      .where(eq(Users.username, username));

    return res.status(200).json({
      message: "User updated successfully!",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { password, newPassword } = req.body;
  const { username } = res.locals.user;
  try {
    const user = await db
      .select()
      .from(Users)
      .where(eq(Users.username, username));

    if (user.length === 0) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    const isPasswordValid = await compare(password, user[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password!" });
    }

    await db
      .update(Users)
      .set({ password: await hash(newPassword, 10) })
      .where(eq(username, username));

    return res.status(200).json({
      message: "Password updated successfully!",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
