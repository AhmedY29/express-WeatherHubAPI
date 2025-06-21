import { Request, Response } from "express";
import { Weather } from "../models/weather.model";
import { History } from "../models/history.model";
import { verifyToken } from "../utils/generateToken";
import axios from 'axios'


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
      const weatherExist = await Weather.findOne({lon:lon, lat:lat})
        console.log(weatherExist)
      if(weatherExist){
        const newHistory = new History({
            user: verify.userId,
            weather:weatherExist._id
        })
        await newHistory.save()
        res.status(200).json({
        success:true,
        source: "cache",
        data:weatherExist
      })
      return;
      }

      const getFromEApi = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`)
      const weatherData = await getFromEApi.data
      

      
      const newWeather = new Weather({
        lat:weatherData.coord.lat,
        lon:weatherData.coord.lon,
        data:{
            coordinates: weatherData.coord,
            tempC: Number((weatherData.main.temp - 272.15).toFixed(2)),
            humidity: weatherData.main.humidity,
            description: weatherData.weather[0].description,
        },
      })
      
      await newWeather.save()
        const newHistory = new History({
            user: verify.userId,
            weather: newWeather._id
        })

      await newHistory.save()
      res.status(200).json({
        success:true,
        source: "openweather",
        data:newWeather
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
