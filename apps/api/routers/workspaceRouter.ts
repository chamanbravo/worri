import express from "express";
import {
  createWorkspace,
  deleteWorkspace,
  listWorkspaces,
  updateWorkspace,
} from "../controllers/workspaces";
import { zodParser } from "../middlewares/zodParser";
import verifyToken from "../middlewares/verifyToken";
import {
  createWorkspaceSchema,
  deleteWorkspaceSchema,
  updateWorkspaceSchema,
} from "../schemas/workspaceSchema";

const WorkspaceRouter = express.Router();

WorkspaceRouter.post(
  "/workspaces",
  zodParser(createWorkspaceSchema),
  verifyToken,
  createWorkspace
);
WorkspaceRouter.get("/workspaces", verifyToken, listWorkspaces);
WorkspaceRouter.patch(
  "/workspaces",
  zodParser(updateWorkspaceSchema),
  updateWorkspace
);
WorkspaceRouter.delete(
  "/workspaces",
  zodParser(deleteWorkspaceSchema),
  verifyToken,
  deleteWorkspace
);

export default WorkspaceRouter;
