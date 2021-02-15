import express,{Response,Request} from 'express';
import {IUser,User} from '../schemas/UserSchema';
export const router = express.Router();

router.route('/')
.post((req:Request,res:Response)=>{
    const member: IUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email
    });
    member.save().then(()=>{
        console.log(member);
    }).catch(()=>{
        console.log("err");
    });
})
.patch((req:Request,res:Response)=>{
    
});