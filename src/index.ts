import app from "./server";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { Request, Response } from "express";

export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as Request, res as Response);
};