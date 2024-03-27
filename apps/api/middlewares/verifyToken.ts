import { Request, Response, NextFunction } from "express";
import jwt, { Secret } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    res.status(400).json({ message: "Authentication required." });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET as Secret, (err, decoded) => {
    if (err) {
      res.status(400).json({ message: "Invalid token." });
      return;
    }
    res.locals.user = decoded;
    next();
  });
};

export default verifyToken;
