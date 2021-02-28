import dotenv from 'dotenv'
dotenv.config();
import express, {Request,Response} from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { db } from './db';
import cors from 'cors';
import  { router as UserRouter }  from './routes/UserRouter';
import {router as LoginRouter} from './routes/LoginRouter';
import {router as WorshipRouter} from './routes/WorshipRouter';
import passport from 'passport';
import crypto from 'crypto';
import session from 'express-session';
import  MongoStore  from 'connect-mongo';
import flash from 'connect-flash';
import { IUser, User } from './schemas/UserSchema';
const LocalStrategy = require('passport-local').Strategy;

const app = express();
db();
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use(session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized:true,
    store: MongoStore.create({
        mongoUrl: `mongodb://localhost:27017/${process.env.DB_NAME}`,
        crypto: {
            secret: process.env.SECRET!
          },
          ttl:1209600
          
    }),
    // cookie: {
    //     secure: false,

    //     maxAge: 0 * 86400 * 1000
    // }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use('/signup',UserRouter);
app.use('/login',LoginRouter);
app.use('/worship',WorshipRouter);

function validePassword(password: string, hash:string, salt:string):boolean{
    const hashVerify: string = crypto.pbkdf2Sync(password,salt,parseInt(process.env.LOOP!),64,'sha512').toString('hex');
    return hash === hashVerify;
}


passport.use(new LocalStrategy(
    {
        usernameField: 'userName',
        passwordField: 'password'
    },
    function(userName: string,password: string, cb:Function){
        User.findOne({userName}).then((user)=>{
            if(user){
                console.log(1);
            const isValid = validePassword(password, user.hash,user.salt)
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
    }
));



passport.serializeUser<any,any>((req,user,done)=>{
    done(undefined,user)
})

passport.deserializeUser((id,done)=>{
    User.findById(id,(err: Error, user:IUser)=>{
        done(err, user.id);
    })
})


app.get('/',(req:Request,res:Response) =>{
    
});



app.listen(process.env.PORT,()=>{
    console.log("app is listening on Port 8000");
});