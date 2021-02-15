import express,{Response,Request} from 'express';
import { Mongoose } from 'mongoose';
import {IUser, User} from '../schemas/UserSchema';
export const router = express.Router();

router.post('/',(req:Request,res:Response)=>{
    User.findOne({userName:req.body.userName},(err:Error,data:IUser)=>{
        if(data){
            if(req.body.password === data.password){
                res.send("Log in");
            }else{
                res.send("asdas");
            }
        }
    })
});