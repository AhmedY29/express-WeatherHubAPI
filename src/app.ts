import express, { Express, Request, Response, NextFunction } from 'express';
import logger from './utils/logger';
import dotenv from 'dotenv';
import { connectDB } from './config/connectDB';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/user.route'
import historyRoutes from './routes/history.route'
import weatherRoutes from './routes/weather.route'

const app: Express = express();

dotenv.config();

app.use(helmet());
app.use(cors());
app.use(cors());
app.use(morgan('tiny', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/auth', authRoutes);
app.use('/history', historyRoutes);
app.use('/weather', weatherRoutes);

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res
    .status(500) //INTERNAL_SERVER_ERROR
    .json({
      success: false,
      message: `Something went wrong! ${err.message}`,
      error: process.env.NODE_ENV == 'development' ? err.message : undefined
    });
});

app.get('/', (req: Request, res: Response) =>{
    res.status(200) //OK
    .json({
        success:true,
        message:'Welcome to WeatherHub API - By Ahmed alsaleh',
        routes:{
            auth:`POST: For Sign Up: "/auth/signup", Sign In: "/auth/signin", Sign Out: "/auth/signin" `,
            weather:`Get: Weather With Specific coordinates: EX: "/weather?lat=24.71&lon=46.68" `,
            history:`Get: History List: "/history" You can add some Query Params like: "/history?skip=0&limit=10&sort=-requestedAt"`,
        }
    })
})

app.listen(process.env.PORT, () => {
    logger.info(`Server Listen at Port ${process.env.PORT}`)
    connectDB()
})

