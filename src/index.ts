import dotenv from 'dotenv'
dotenv.config();
import express, {Request,response,Response} from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {db} from './db';
import cors from 'cors';
import  { router as UserRouter }  from './routes/UserRouter';
import {router as LoginRouter} from './routes/LoginRouter';
import {router as WorshipRouter} from './routes/WorshipRouter';
import passport from 'passport';
import crypto from 'crypto';
import session from 'express-session';
import  MongoStore  from 'connect-mongo';
import {UserData} from './routes/LoginRouter';
import { IUser, User } from './schemas/UserSchema';
const LocalStrategy = require('passport-local').Strategy;
db();
const corsOptions ={
    origin:`https://${process.env.ORIGIN}`,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors(corsOptions));
const store = MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.DB_USERNAME+":"+process.env.DB_PASSWORD}@cluster0.umkpc.mongodb.net/${process.env.DB_NAME}`
})
app.use(session({
   
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized:true,
    store: store,
    cookie: {
        domain:process.env.ORIGIN,
        path: '/',
        httpOnly:true,
        secure:true,
        maxAge: 60*60*1000
    }
}));
app.use(passport.initialize());
app.use(passport.session());


function validPassword(password: string, hash:string, salt:string):boolean{
    const hashVerify: string = crypto.pbkdf2Sync(password,salt,parseInt(process.env.LOOP!),64,'sha512').toString('hex');
    return hash === hashVerify;
}


passport.use(new LocalStrategy(
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    
        function(userName:string, password:string, cb:any) {
            console.log("Passport local")
            
        User.findOne({userName}).then((user)=>{
            if(user){
                console.log(1);
            const isValid = validPassword(password, user.hash,user.salt)
            if(isValid){
                console.log(2);

                return cb(null,user);
            }else{
                console.log(3);

                return cb(null, false, { message: 'Incorrect password.'});
            }
            }else{
                console.log(4);

                return cb(null, false, { message: 'Incorrect username.' });
            }
        }).catch((err)=>{
            cb(err);
        });
    }));
    



passport.serializeUser<any,any>((user:UserData,done:any)=>{
    const {userName,firstName,lastName,isAdmin} = user;
    done(null,{
        userName,
        firstName,
        lastName,
        isAdmin
    });
})

passport.deserializeUser((user:UserData,done)=>{
    console.log("deserializeUser",user);

    User.findOne({userName:user.userName},(err: Error, user:IUser)=>{
        done(err, user);
    })
});
app.use('/signup',UserRouter);
app.use('/login',LoginRouter);
app.use('/worship',WorshipRouter);

app.get('/',(req:Request,res:Response) =>{
    console.log("first");
   if(req.session){
        res.send(req.session);
   }else{
       res.send();
   }
});

app.get('/logout',(req:Request,res:Response)=>{
    req.session.destroy((err)=>{
        if(err){
            throw err
        }else{
            res.send({message:"Successfully logged out"});
        }
    });
});


app.listen(process.env.PORT,()=>{
    console.log("app is listening on Port 8000");
});