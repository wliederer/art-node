import express, { Request, Response } from 'express';
import { artAws } from '../controllers/art.controllers';

const artRouter = express.Router();

artRouter.get('/art',async (req:Request,res:Response)=> await artAws(req,res))

export default artRouter;