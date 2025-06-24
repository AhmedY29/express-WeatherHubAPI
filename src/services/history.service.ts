import { History } from "../models/history.model"
import { Weather } from "../models/weather.model"
import axios from "axios"




export const getHistoryService = async (count: any, limit: any, skip:any, sort:any, verify:any) => {
      if(count == 'true'){
            const historyCount = await History.find();
            return {total:historyCount.length }
        }
      const historyExist = await History.find({user: verify.userId}).populate({
            path: 'weather',
          }).sort(sort as string).limit(Number(limit)).skip(parseInt(skip as string))
 
          return historyExist
}