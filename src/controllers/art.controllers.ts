import  { Request, Response } from 'express';


export const artAws = async (req:Request,res:Response) => {
    try{
        return res.status(200).send('here again')
    }catch(err){
        console.error(err)
        return res.status(500)
    }
}