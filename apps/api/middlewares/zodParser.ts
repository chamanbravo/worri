import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

export function zodParser(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          [issue.path.join(".")]: `${issue.path.join(
            "."
          )} is ${issue.message.toLowerCase()}`,
        }));
        res.status(400).json({ error: "Invalid data", details: errorMessages });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };
}
