import dotenv from 'dotenv'
dotenv.config();
import express, {Request,response,Response} from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import {db, connection } from './db';
import cors from 'cors';
import  { router as UserRouter }  from './routes/UserRouter';
import {router as LoginRouter} from './routes/LoginRouter';
import {router as WorshipRouter} from './routes/WorshipRouter';
import passport from 'passport';
import crypto from 'crypto';
import session, { Session } from 'express-session';
import  MongoStore  from 'connect-mongo';
import flash from 'connect-flash';
import { IUser, User } from './schemas/UserSchema';
import { Model, Mongoose } from 'mongoose';
import mongoose from 'mongoose';
const LocalStrategy = require('passport-local').Strategy;
db();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
const store = MongoStore.create({
    mongoUrl: `mongodb://localhost:27017/${process.env.DB_NAME}`
})
app.use(session({
   
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized:true,
    store: store,
    cookie: {
        path: '/',
        httpOnly:true,
        secure:false,
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
    



passport.serializeUser<any,any>((user,done:any)=>{
    console.log("serializeUser",user);
    done(null,user.userName);
})

passport.deserializeUser((userName:string,done)=>{
    console.log("deserializeUser",userName);

    User.findOne({userName},(err: Error, user:IUser)=>{
        console.log("hello");
        done(err, user);
    })
});
app.use('/signup',UserRouter);
app.use('/login',LoginRouter);
app.use('/worship',WorshipRouter);

app.get('/',(req:Request,res:Response) =>{
   const session =Object.values<string>(req.cookies)[0]
    if(session){
        store.get(session,(err:Error,session)=>{
            console.log(session);
        })

    }
});

app.get('/logout',(req:Request,res:Response)=>{
    console.log("hello");
    const session =Object.values<string>(req.cookies)[0];
    console.log(session);
    store.destroy(session,(err)=>{
        if(err){
            throw err;
        }
});
});


app.listen(process.env.PORT,()=>{
    console.log("app is listening on Port 8000");
});