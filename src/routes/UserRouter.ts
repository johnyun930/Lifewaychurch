import express,{Response,Request} from 'express';
import {IUser,User} from '../schemas/UserSchema';
import crypto from 'crypto';
import {  UserData } from './LoginRouter';
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
.post((req:Request,res:Response,next)=>{
    const {userName,password,firstName,lastName,email} = req.body;
    const saltHash = genPassword(password);
    const isAdmin = false;
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const member: IUser = new User({
        userName,
        salt,
        hash,
        firstName,
        lastName,
        email,
        isAdmin
    });
    member.save().then(()=>{
        console.log("successto save");
              let userData: UserData = {
                userName: member.userName,
                firstName: member.firstName,
                lastName: member.lastName,
                isAdmin: member.isAdmin,
              }
              
              req.logIn(member, function(err) {
                  if (err) { return next(err); }
                  return res.send(userData);
                });
      
            }
        )
       .catch((err)=>{
        res.send({errorMessage:`It is existed ${Object.keys(err.keyValue)}. Please use another ${Object.keys(err.keyValue)}. `});
    });
})
.patch((req:Request,res:Response)=>{
    
});