import express, {Request,Response} from 'express';
import {IPost, QT} from '../schemas/PostSchema';
import multer from 'multer';
import {IsNotice} from './BibleStudyRouter';

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"public/QT");
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
    
    QT.find((err,docs)=>{
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
    QT.find((err,docs)=>{
        if(docs.length!==0){
         id = docs[0].id+1;
        }
        const post: IPost = new QT({
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
    
   
    
});

router.route('/:id').
get((req:Request,res:Response)=>{
    QT.findById(req.params.id,(err:Error,doc:IPost)=>{
        res.send(doc);
    });
})
.delete((req:Request,res:Response)=>{
    QT.findByIdAndDelete(req.params.id).then(()=>{
        res.send({message:"Successfully deleted"});
    });
    });
