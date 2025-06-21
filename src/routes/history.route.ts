import { getHistory } from '../controllers/history.controller';
import { Router } from 'express';


const router = Router();



router.get('/', getHistory)


export default router