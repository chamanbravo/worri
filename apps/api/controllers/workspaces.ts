import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { workspaces, workspacesUsers } from "../db/schema";
import db from "../db";
import logger from "../logger";
import { eq } from "drizzle-orm";

export const createWorkspace = async (req: Request, res: Response) => {
  const { name } = req.body;
  const { id: user_id } = res.locals.user;
  try {
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(workspaces.name, name));

    if (existingWorkspace.length > 0) {
      return res.status(400).json({ message: "Workspace already exists!" });
    }

    const workspace = await db
      .insert(workspaces)
      .values({ name, access_code: uuidv4().split("-")[0] })
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        access_code: workspaces.access_code,
      })
      .onConflictDoNothing();

    await db
      .insert(workspacesUsers)
      .values({
        role: "admin",
        workspace_id: workspace[0].id,
        user_id: user_id,
      })
      .onConflictDoNothing();

    return res.status(200).json({
      message: "Workspace created successfully!",
      details: workspace,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const listWorkspaces = async (req: Request, res: Response) => {
  try {
    const workspacesList = await db.select().from(workspaces);
    return res.status(200).json({
      message: "Workspaces listed successfully!",
      details: workspacesList,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateWorkspace = async (req: Request, res: Response) => {
  const { id, name, access_code } = req.body;
  try {
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(id, id));
    if (existingWorkspace.length === 0) {
      return res.status(400).json({ message: "Workspace does not exist!" });
    }

    const updatedWorkspace = await db
      .update(workspaces)
      .set({ name, access_code })
      .where(eq(workspaces.id, id))
      .returning({
        id: workspaces.id,
        name: workspaces.name,
        access_code: workspaces.access_code,
      });

    return res.status(200).json({
      message: "Workspace updated successfully!",
      details: updatedWorkspace,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteWorkspace = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const existingWorkspace = await db
      .select()
      .from(workspaces)
      .where(eq(id, id));
    if (existingWorkspace.length === 0) {
      return res.status(400).json({ message: "Workspace does not exist!" });
    }

    await db.delete(workspaces).where(eq(id, id));
    return res.status(200).json({ message: "Workspace deleted successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ message: "Something went wrong!" });
  }
};
