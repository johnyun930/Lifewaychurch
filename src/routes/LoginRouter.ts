import express,{Response,Request} from 'express';
import {IUser, User} from '../schemas/UserSchema';
export const router = express.Router();

router.post('/',(req:Request,res:Response)=>{
    User.findOne({userName:req.body.userName},(err:Error,data:IUser)=>{
        console.log("logging");
        if(data){
            if(req.body.password === data.password){

                console.log("log in");
                res.redirect('/');
            }else{
                res.send("Id or Password is wrong");
            }
        }
    })
});