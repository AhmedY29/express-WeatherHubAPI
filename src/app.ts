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


app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/weather', weatherRoutes);

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res
    .status(500) //INTERNAL_SERVER_ERROR
    .json({
      success: false,
      message: 'Something went wrong!',
      error: process.env.NODE_ENV == 'development' ? err.message : undefined
    });
});

app.listen(process.env.PORT, () => {
    logger.info(`Server Listen at Port ${process.env.PORT}`)
    connectDB()
})

