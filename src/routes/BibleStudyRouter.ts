import express, {Request,Response} from 'express';
import {IPost, BibleStudy, PostSchema} from '../schemas/PostSchema';
import multer from 'multer';
import { BibleStudyReview, IReview } from '../schemas/ReviewSchema';

export enum IsNotice {
    false="0",
    true = "1"
}

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./build/public/biblestudy");
    },
    filename: (req, file, callback)=>{
        console.log(req.body);
        callback(null,`${Date.now()+file.originalname}`)
    }
});


export const upload = multer({storage,limits:{
    files: 1,
    fileSize:1024*1024*3}
    
},

).single('file');
export const router = express.Router();

router.route('/')
.get((req:Request,res:Response)=>{
    
    BibleStudy.find((err,docs)=>{
        if(err){
            console.log(err);
        }else{
            res.send(docs);
        }
    })
})
.post((req:Request,res:Response)=>{
    upload(req, res, function (err:any ) {
        if (err instanceof multer.MulterError) {
            res.send({error:"File is too big. 1MB is Maximum"});
            return;
            // A Multer error occurred when uploading.
        };
     const {title,context,composer,notice,bibleText} = req.body;
    
    const date = new Date();
    let file: string;
    if(req.file){
    const file = req.file.path;
    }
    let isnotice = false;
    if(notice === IsNotice.true){
        isnotice= true;
    }
    let id =1;
    BibleStudy.find((err,docs)=>{
        if(docs.length!==0){
         id = docs[0].id+1;
        console.log(id);
        }
        const post: IPost = new BibleStudy({
            id,
            title,
            bibleText,
            date,
            composer,
            context,
            notice: isnotice,
            file
        });
        post.save().then(()=>{
          res.send([]);
        })
        
    }).sort({id:-1}).limit(1);
   
    });
    
   
    
}).patch((req:Request,res:Response)=>{
    const {Id,title,bibleText,context} = req.body;
    console.log(Id);
    BibleStudy.findByIdAndUpdate(Id,{title,bibleText,context},{returnOriginal:false},(err,doc)=>{
       if(err){
           res.send({errMessage: "Sorry, fail to update. Please try again"});
       }else{
           res.send(doc);
       }
    });
});

router.route('/:id').
get((req:Request,res:Response)=>{
    BibleStudy.findById(req.params.id,(err:Error,doc:IPost)=>{
        res.send(doc);
    });
})
.delete((req:Request,res:Response)=>{
    console.log("deleting");

    BibleStudy.findByIdAndDelete(req.params.id).then(()=>{
        BibleStudyReview.deleteMany({postingId:req.params.id},undefined,(err)=>{
            if(err){
                console.log("Fail to delete the all review of the post");
            }else{
                res.send({message:"Successfully deleted"});
            }
        });
    }).catch((err)=>{
        if(err){
            res.send({errMessage:"Fail to delete post Try Aagin"});
        }
    });
    });


router.route('/review')
.post((req:Request,res:Response)=>{
    const {postingId,reviewer,comment} = req.body;
    const date = new Date();
    const review : IReview = new BibleStudyReview({
        postingId,
        reviewer,
        comment,
        date
    });
    review.save((err,doc)=>{
        if(err){
            res.send({errMessage:"Sorry. Please Try Again"});
        }else{
            res.send(doc);
        }
    });

}).patch((req:Request,res:Response)=>{
    const {_id,comment} = req.body;
    BibleStudyReview.findByIdAndUpdate(_id,{comment},{returnOriginal:false},(err,doc)=>{
       if(err){
           res.send({errMessage: "Sorry, fail to update. Please try again"});
       }else{
           console.log("patching");
           res.send(doc);
       }
    });
});
router.route("/review/:Id")
.get((req:Request,res:Response)=>{
    BibleStudyReview.find({postingId:req.params.Id},(err:Error,doc:IReview)=>{
        res.send(doc);
    });
})
.delete((req:Request,res:Response)=>{
    BibleStudyReview.findByIdAndDelete(req.params.Id,null,(err)=>{
        if(err){
            res.send({errMessage:"Sorry, fail to delete. Try again"});
        }else{
            res.send();
        }
    });
})

