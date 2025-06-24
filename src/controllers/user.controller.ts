import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../utils/generateToken";
import { getSignInService, getSignOutService, getSignUpService } from "../services/user.service";



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

            // const header = new Headers({Authorization: `Bearer ${token}`})
            // res.setHeaders(header)

            const signUpService = await getSignUpService(email, password)

        res.status(201) //CREATED
        .json(signUpService)
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

        // const header = new Headers({Authorization: `Bearer ${token}`})
        // res.setHeaders(header)
        const signInService = await getSignInService(email, password)
    res.status(200) // OK
    .json(signInService)

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

        const signOutService = await getSignOutService()

        res.status(200) // OK
        .json(signOutService)

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