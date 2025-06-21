import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../utils/generateToken";



export const signUp = async (req: Request, res: Response) => {
    const { email, password } = req.body
    try {
        if(!email || !password){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Felid!'
                }
            })
            return;
        }

        const userExist = await User.findOne({ email });

        if(userExist){
            res.status(400)
            .json({
                success:false,
                error:{
                    message:"Email Already Exist"
                }
            })
            return;
        }

        const HashPass: string = await bcrypt.hash(password, 10) ;

        const newUser = new User({
            email,
            passwordHash: HashPass,
            role:'user'
        })
        await newUser.save();

        const token = generateToken(newUser._id)

        const header = new Headers({Authorization: `Bearer ${token}`})
        res.setHeaders(header)

        res.status(201) //CREATED
        .json({
            success:true,
            message:'Created User Successfully',
            token
        })
    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Sign Up: ${error.message}`
            }
        })
    }

}

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        if(!email || !password){
            res.status(400) //BAD REQUEST
            .json({
                success:false,
                error:{
                    message:'Please Fill Felid!'
                }
            })
            return;
        }

        const userExist = await User.findOne({ email });
        if(!userExist){
            res.status(401) // UNAUTHORIZED
            .json({
                success:false,
                error:{
                    message:"Email Or Password Invalid"
                }
            })
            return;
        }
        const passCorrect = await bcrypt.compare(password, userExist.passwordHash)
        if(!passCorrect){
            res.status(401) // UNAUTHORIZED
            .json({
                success:false,
                error:{
                    message:"Email or Password Invalid"
                }
            })
            return;
        }

        const token = generateToken(userExist._id)
        
        const header = new Headers({Authorization: `Bearer ${token}`})
        res.setHeaders(header)
    res.status(200) // OK
    .json({success: true, message:'Logged in successfully',
        data: {...userExist._doc, passwordHash: undefined},
        token
    })

    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Sign In: ${error.message}`
            }
        })
    }

}

export const signOut = async (req: Request, res: Response) => {
    try {
        const tokenHeader = req.headers.authorization;
        console.log(tokenHeader)
          if (!tokenHeader) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
        }

        const token = tokenHeader.split(" ")[1]
        const verify = verifyToken(token)

        console.log(verify)

        if(!verify){
            res.status(401) // UNAUTHORIZED
            .json({
                success: false,
                error:{
                    message: 'Token Invalid'
                }
            })
        }

        res.status(200) // OK
        .json({
            success:true,
            message: 'Logged out Successfully'
        })

    } catch (error: any) {
        res.status(400)
        .json({
            success:false,
            error:{
                message:`Error in Sign Out: ${error.message}`
            }
        })
    }

}