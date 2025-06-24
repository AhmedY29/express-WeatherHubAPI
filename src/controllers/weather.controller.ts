import { Request, Response } from "express";
import { Weather } from "../models/weather.model";
import { History } from "../models/history.model";
import { verifyToken } from "../utils/generateToken";
import axios from 'axios'
import { getWeatherService } from "../services/weather.service";


export const getWeather = async (req: Request, res: Response) => {
    const { lon, lat } = req.query
    console.log( lon , lat)
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
     const weatherDate = await getWeatherService(lat, lon, verify)
      res.status(200).json({
        success:true,
        data:weatherDate
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
