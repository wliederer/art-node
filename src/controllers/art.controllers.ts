import  { Request, Response } from 'express';
import { getBucket } from '../services/art.services';


export const artAws = async (req:Request,res:Response) => {
    try{
        const art = await getBucket();
        if(art){
            return res.status(200).send(art)
        }
        else {
            return res.status(200).send('no art')
        }
    }catch(err){
        console.error(err)
        return res.status(500)
    }
}