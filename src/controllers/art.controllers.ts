import { Request, Response } from "express";
import { getBucket } from "../services/art.services";

export const artAws = async (req: Request, res: Response) => {
  try {
    return await getBucket().then((data) => {
      let names = data.names;
      Promise.all(data.signedUrls).then((stuff) => {
        return res.send({ names, stuff });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500);
  }
};
