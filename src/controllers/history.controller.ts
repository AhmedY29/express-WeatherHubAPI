import { getHistoryService } from "../services/history.service";
import { History } from "../models/history.model"
import { verifyToken } from "../utils/generateToken"
import { Request, Response } from "express";



export const getHistory = async (req: Request, res: Response) => {
    const { count, skip, limit, sort } = req.query
    console.log(req.headers.authorization)

    const token = req.headers.authorization
    const verify = verifyToken(token?.split(' ')[1] as string)
    if(!verify){
        res.status(401) // UNAUTHORAIZE
        .json({
            success:false,
            error:{
                message: 'un authorize: You have To Sign In'
            }
        })
        return
    }
    try {
       const historyData = await getHistoryService(count, limit, skip, sort, verify)
      res.status(200).json({
        success:true,
        data:historyData
      })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Get Weather: ${error.message}`
            }
        })
    }

}
