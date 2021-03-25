import express, {Request,Response} from 'express';
import {IWorship, Worship} from '../schemas/WorshipSchema';

export const router = express.Router();

router.route('/')

.get((req:Request,res:Response)=>{
    console.log(req.session.id);

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
    console.log(service);
    service.save((err,doc)=>{
        if(err){
            res.send({errMessage:"Sorry. Please Try Again"});
        }else{
            res.send();
        }
    });
});
router.route('/:id').
get((req:Request,res:Response)=>{
    Worship.findById(req.params.id,(err:Error,doc:IWorship)=>{
        res.send(doc);
    });
})
.delete((req:Request,res:Response)=>{
    Worship.findByIdAndDelete(req.params.id).then(()=>{
        res.send({message:"Successfully deleted"});
    });
    });
