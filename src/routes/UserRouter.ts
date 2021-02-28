import express,{Response,Request} from 'express';
import {IUser,User} from '../schemas/UserSchema';
import crypto from 'crypto';
export const router = express.Router();


function genPassword(password:string){
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password,salt,parseInt(process.env.LOOP!),64,'sha512').toString('hex');
    return{
        salt: salt,
        hash: genHash
    }

}

router.route('/')
.get((req:Request,res:Response)=>{
    User.find({},(err:Error,doc:IUser[])=>{
        console.log(doc);
    })
})
.post((req:Request,res:Response)=>{
    const {userName,password,firstName,lastName,email} = req.body;
    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const member: IUser = new User({
        userName,
        salt,
        hash,
        firstName,
        lastName,
        email
    });
    member.save().then(()=>{
        console.log(member);
        res.redirect('http://localhost:3000/');
    }).catch(()=>{
        console.log("err");
    });
})
.patch((req:Request,res:Response)=>{
    
});