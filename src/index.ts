import dotenv from 'dotenv'
dotenv.config();
import express, {Request,Response} from 'express';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import {db} from './db';
import cors from 'cors';
import  { router as UserRouter }  from './routes/UserRouter';
import {router as LoginRouter} from './routes/LoginRouter';
import {router as WorshipRouter} from './routes/WorshipRouter';
import {router as BibleStudyRouter} from './routes/BibleStudyRouter';
import {router as QTRouter} from './routes/QTRouter';
import {router as ChildSchoolRouter} from './routes/ChildSchoolRouter';
import {router as BulletenBoardRouter} from './routes/BulletenBoardRouter';


import passport from 'passport';
import crypto from 'crypto';
import session from 'express-session';
import  MongoStore  from 'connect-mongo';
import {UserData} from './routes/LoginRouter';
import { IUser, User } from './schemas/UserSchema';
import { BibleStudy, BulletenBoard, ChildSchool, QT } from './schemas/PostSchema';
import { BibleStudyReview, BulletenBoardReview, ChildSchoolReview, QTReview } from './schemas/ReviewSchema';
export const upload = multer({dest:'uploads/'});
const LocalStrategy = require('passport-local').Strategy;
db();
const corsOptions ={
    origin:`https://${process.env.ORIGIN}`,
    //  origin:`http://${process.env.LOCAL}`,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors(corsOptions));
const store = MongoStore.create({
    mongoUrl: `mongodb+srv://${process.env.DB_USERNAME+":"+process.env.DB_PASSWORD}@cluster0.umkpc.mongodb.net/${process.env.DB_NAME}`
    // mongoUrl: `mongodb://localhost:27017/${process.env.DB_NAME}`

})
app.use(session({
    secret: process.env.SECRET!,
    resave: false,
    saveUninitialized:true,
    store: store,
    cookie: {
        domain:'.lifewaygen.ga',
        //  domain:'localhost',
        path: '/',
        httpOnly:true,
        secure: false,
        maxAge: 60*60*1000
}}));
app.use(passport.initialize());
app.use(passport.session());


export function validPassword(password: string, hash:string, salt:string):boolean{
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
app.use('/biblestudy',BibleStudyRouter);
app.use('/qt',QTRouter);
app.use('/bulletenboard',BulletenBoardRouter);
app.use('/childschool',ChildSchoolRouter);


app.get('/',(req:Request,res:Response) =>{
   if(req.session){
       console.log(req.session.id);
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

app.get('/postcount/:username',async (req:Request,res:Response)=>{
    const composer = req.params.username;
    const reviewer = composer
    
   const numofBS = await BibleStudy.countDocuments({composer},(err)=>{
    if(err){
        throw err;
    }
    });

    const numofBSReview = await BibleStudyReview.countDocuments({reviewer},(err)=>{
        if(err){
            throw err;
        }
    });
    const numofQT = await QT.countDocuments({composer},(err)=>{
        if(err){
            throw err;
        }
        });
    
        const numofQTReview = await QTReview.countDocuments({reviewer},(err)=>{
            if(err){
                throw err;
            }
        });

        const numofBTB = await BulletenBoard.countDocuments({composer},(err)=>{
            if(err){
                throw err;
            }
            });
        
            const numofBTBReview = await BulletenBoardReview.countDocuments({reviewer},(err)=>{
                if(err){
                    throw err;
                }
            });

            const numofCS = await ChildSchool.countDocuments({composer},(err)=>{
                if(err){
                    throw err;
                }
                });
            
                const numofCSReview = await ChildSchoolReview.countDocuments({reviewer},(err)=>{
                    if(err){
                        throw err;
                    }
                });
            const totalPost = numofBS + numofBTB + numofCS + numofQT;
            res.send({numofBS,numofBSReview,numofQT,numofQTReview,numofCS,numofCSReview,numofBTB,numofBTBReview,totalPost});

});


app.listen(process.env.PORT,()=>{
    console.log("app is listening on Port 8000");
});