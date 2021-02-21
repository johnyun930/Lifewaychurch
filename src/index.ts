import dotenv from 'dotenv'
dotenv.config();
import express, {Request,Response} from 'express';
import bodyParser from 'body-parser';
import { db } from './db';
import cors from 'cors';
import  { router as UserRouter }  from './routes/UserRouter';
import {router as LoginRouter} from './routes/LoginRouter';
import {router as WorshipRouter} from './routes/WorshipRouter';
const app = express();
db();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.use('/signup',UserRouter);
app.use('/login',LoginRouter);
app.use('/worship',WorshipRouter);



app.get('/',(req:Request,res:Response) =>{
    
});



app.listen(process.env.PORT,()=>{
    console.log("app is listening on Port 8000");
});