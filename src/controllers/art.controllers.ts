import { Request, Response } from "express";
import { getBucket } from "../services/art.services";

export const artAws = async (req: Request, res: Response) => {
  try {
    return await getBucket().then((data) => {
      Promise.all(data).then((stuff) => {
        return res.send(stuff);
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};
