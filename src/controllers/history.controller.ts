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
        if(count == 'true'){
            const historyCount = await History.find();
            res.status(200) //OK
            .json({
                success: true,
                total: historyCount.length
            })
        }
      const historyExist = await History.find({user: verify.userId}).populate({
            path: 'weather',
          }).sort(sort as string).limit(Number(limit)).skip(parseInt(skip as string))

      res.status(200).json({
        success:true,
        data:historyExist
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
