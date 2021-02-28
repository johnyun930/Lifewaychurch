import { json } from 'body-parser';
import express, {Request,Response} from 'express';
import {IWorship, Worship} from '../schemas/WorshipSchema';

export const router = express.Router();

router.route('/')

.get((req:Request,res:Response)=>{
    console.log(req.cookies);
    Worship.find({},(err:Error,doc:IWorship[])=>{
        res.send(JSON.stringify(doc));
    })

}).post((req:Request,res:Response)=>{
    const {title,offering,prayer,startingHymm,bibleText,context,videoURL,endingHymm} = req.body;
    const date = new Date();
    const service: IWorship = new Worship({
        title,
        date,
        prayer,
        offering,
        startingHymm,
        bibleText,
        context,
        videoURL,
        endingHymm
    });

    service.save().then((result)=>{
        res.redirect('http://localhost:3000/worship');
    }).catch((err)=>{
        console.log(err);
    })
});

router.get('/:id',(req:Request,res:Response)=>{
    Worship.findById(req.params.id,(err:Error,doc:IWorship)=>{
        res.send(JSON.stringify(doc));
    })
})