import express, {Request,Response} from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req:Request,res:Response) =>{
    console.log("getting");
});



app.listen(process.env.PORT,()=>{
    console.log("app is listening on Port 3000");
});