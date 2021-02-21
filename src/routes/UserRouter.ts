import express,{Response,Request} from 'express';
import {IUser,User} from '../schemas/UserSchema';
export const router = express.Router();

router.route('/')
.get((req:Request,res:Response)=>{
    User.find({},(err:Error,doc:IUser[])=>{
        console.log(doc);
    })
})
.post((req:Request,res:Response)=>{
    const {userName,password,firstName,lastName,email} = req.body;
    const member: IUser = new User({
        userName,
        password,
        firstName,
        lastName,
        email
    });
    member.save().then(()=>{
        console.log(member);
    }).catch(()=>{
        console.log("err");
    });
})
.patch((req:Request,res:Response)=>{
    
});