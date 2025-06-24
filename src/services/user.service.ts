import { User } from "../models/user.model";
import { generateToken, verifyToken } from "../utils/generateToken";
import bcrypt from "bcrypt"


export const getSignUpService = async (email: string, password:string, ) => {
    const userExist = await User.findOne({ email });
    
            if(userExist){
                return {
                    success:false,
                    error:{
                        message:"Email Already Exist"
                    }
                }
            }
    
            const HashPass: string = await bcrypt.hash(password, 10) ;
    
            const newUser = new User({
                email,
                passwordHash: HashPass,
                role:'user'
            })
            await newUser.save();
    
            const token = generateToken(newUser._id)
    
            return{
                success:true,
                message:'Created User Successfully',
                token
            }
}

export const getSignInService = async (email: string, password:string, ) => {
    const userExist = await User.findOne({ email });
            if(!userExist){
                return{
                    success:false,
                    error:{
                        message:"Email or Password Invalid"
                    }
                }
            }
            const passCorrect = await bcrypt.compare(password, userExist.passwordHash)
            if(!passCorrect){
                return{
                    success:false,
                    error:{
                        message:"Email or Password Invalid"
                    }
                }
            }
    
            const token = generateToken(userExist._id)
            
            return{
                success: true, message:'Logged in successfully',
                data: {...userExist._doc, passwordHash: undefined},
                token
            }
}



export const getSignOutService = async () =>{

        return{
            success:true,
            message: 'Logged out Successfully'
        }
}