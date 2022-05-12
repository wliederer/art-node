import express, { Request, Response } from "express";
import { artAws } from "../controllers/art.controllers";
import cors from "cors";
import passport from "passport";
import { publicCorsConfig } from "../constants/corsOptions";

const artRouter = express.Router();

artRouter.get(
  "/art",
  cors(publicCorsConfig),
  passport.authenticate(["token"], { session: false }),
  async (req: Request, res: Response) => await artAws(req, res)
);

export default artRouter;
