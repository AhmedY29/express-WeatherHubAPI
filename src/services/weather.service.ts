import { History } from "../models/history.model"
import { Weather } from "../models/weather.model"
import axios from "axios"




export const getWeatherService = async (lat: any, lon: any, verify:any) => {
     const weatherExist = await Weather.findOne({lon:lon, lat:lat})
        console.log(weatherExist)
      if(weatherExist){
        const newHistory = new History({
            user: verify.userId,
            weather:weatherExist._id
        })
        await newHistory.save()
        return {
            source: "cache",
            weather:weatherExist
        } 
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

      return {
            source: "openweather",
            weather:newWeather
      } 
}