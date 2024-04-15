import { Request, Response } from "express";
import { websites, workspaces } from "../db/schema";
import db from "../db";
import logger from "../logger";
import { eq, sql } from "drizzle-orm";

export const addWebsite = async (req: Request, res: Response) => {
  const { domain, name, workspaceId } = req.body;
  const { id: user_id } = res.locals.user;
  try {
    const website = await db
      .insert(websites)
      .values({
        name: name,
        domain: domain,
        created_by: user_id,
        workspace_id: workspaceId,
      })
      .returning({
        id: websites.id,
        name: websites.name,
        domain: websites.domain,
        workspaceId: workspaceId,
      })
      .onConflictDoNothing();

    return res.status(200).json({
      message: "Workspace created successfully!",
      details: website,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const listWebsite = async (req: Request, res: Response) => {
  const { workspaceId } = req.query;
  try {
    const websiteList = await db
      .select()
      .from(websites)
      .where(sql`${websites.workspace_id} = ${workspaceId}`);

    return res.status(200).json({
      message: "Workspaces listed successfully!",
      details: websiteList,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateWebsite = async (req: Request, res: Response) => {
  const { id, name, domain } = req.body;
  try {
    const existingWorkspace = await db
      .select()
      .from(websites)
      .where(eq(id, id));
    if (existingWorkspace.length === 0) {
      return res.status(400).json({ message: "Workspace does not exist!" });
    }

    const updatedWebsite = await db
      .update(websites)
      .set({ name, domain })
      .where(eq(websites.id, id))
      .returning({
        id: websites.id,
        name: websites.name,
      });

    return res.status(200).json({
      message: "Workspace updated successfully!",
      details: updatedWebsite,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteWebsite = async (req: Request, res: Response) => {
  const { id } = req.query;
  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid website ID" });
    }

    const existingWebsite = await db
      .select()
      .from(websites)
      .where(sql`${websites.id} = ${id}`);

    if (existingWebsite.length === 0) {
      return res.status(400).json({ message: "Website does not exist!" });
    }

    await db.delete(websites).where(sql`${websites.id} = ${id}`);
    return res.status(200).json({ message: "Website deleted successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(400).json({ message: "Something went wrong!" });
  }
};
