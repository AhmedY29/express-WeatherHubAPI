import { signIn, signOut, signUp } from '../controllers/user.controller';
import { Router } from 'express';


const router = Router();



router.post('/signup', signUp )
router.post('/signin', signIn )
router.post('/signout',signOut )


export default router