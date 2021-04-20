import express,{Response,Request} from 'express';
import {IUser,User} from '../schemas/UserSchema';
import crypto from 'crypto';
import {  UserData } from './LoginRouter';
import { validPassword } from '..';
import transporter from '../auth/mailer';
import { IToken, Token, TokenSchema } from '../schemas/Auth';
export const router = express.Router();


function genPassword(password:string){
    const salt = crypto.randomBytes(32).toString('hex');
    const genHash = crypto.pbkdf2Sync(password,salt,parseInt(process.env.LOOP!),64,'sha512').toString('hex');
    return{
        salt: salt,
        hash: genHash
    }

}

router.route('/')

.post((req:Request,res:Response,next)=>{
    const {code,userName,password,firstName,lastName,email} = req.body;

    Token.findOne({email,code},(err:Error,doc:IToken)=>{
        if(doc){
            const saltHash = genPassword(password);
            const isAdmin = false;
            const salt = saltHash.salt;
            const hash = saltHash.hash;
            const member: IUser = new User({
                userName,
                salt,
                hash,
                firstName,
                lastName,
                email,
                isAdmin
            });
            member.save().then(()=>{
                console.log("successto save");
                      let userData: UserData = {
                        userName: member.userName,
                        firstName: member.firstName,
                        lastName: member.lastName,
                        isAdmin: member.isAdmin,
                      }

                      Token.deleteOne({email,code},undefined,(err)=>{
                          if(err){
                              console.log(err);
                          }
                      });
                      
                      req.logIn(member, function(err) {
                          if (err) { return next(err); }
                          return res.send(userData);
                        });
              
                    }
                )
               .catch((err)=>{
                   console.log(err);
                res.send({errorMessage:`It is existed ${Object.keys(err.keyValue)}. Please use another ${Object.keys(err.keyValue)}. `});
            });
        }else{
            res.send({errMessage:"Sorry, try again. If you sent the code before 5min, resend the code please"});
        }
    })

    
})
.patch((req:Request,res:Response,next)=>{
    const {userName,newPassword,password,firstName,lastName,} = req.body;
    if(password===undefined){
        User.findOneAndUpdate({userName},{firstName,lastName},{returnOriginal:false,useFindAndModify:false},(err,doc)=>{
            if(err){
                res.send({errMessage:"Sorry, Please try again"});
            }else if(doc){
                req.logIn(doc,function(err){
                    if (err) { 
                        console.log(err);
                     }else{
                            console.log(doc);
                            let userData: UserData = {
                                userName: doc.userName,
                                firstName: doc.firstName,
                                lastName: doc.lastName,
                                isAdmin: doc.isAdmin,
                              }
                              req.logIn(doc,(err)=>{
                                if (err) { 
                                    return next(err);
                                }
                                return res.send(userData);
                              });
                              }
                            });

                           
                     }
                  });
                 }else{
                    User.findOne({userName}).then((user)=>{
                        if(user){
                        const isValid = validPassword(password, user.hash,user.salt)
                        if(isValid){
                            const saltHash = genPassword(newPassword);
                            const salt = saltHash.salt;
                            const hash = saltHash.hash;
                         User.findOneAndUpdate({userName},{salt,hash},{returnOriginal:false,useFindAndModify:false},(err,doc)=>{
                             if(err){
                                 res.send({errMessage:"Sorry, update failed"});
                             }else{
                                 req.session.destroy((err)=>{
                                     if(err){
                                         console.log(err);
                                     }else{
                                        res.send({message:"Password changed Successfully"});
                                    }
                                })
                             }

                 });
                }else{
                    res.send({errMessage:"Sorry password was wrong, please try again"});
                }
            }
        });
    }
});

router.post('/email',(req:Request,res:Response)=>{
    const {email} = req.body;

    User.findOne({email},(err:Error,doc:IUser)=>{
        if(doc){
            res.send({errMessage:"This email is existed. Please use another email"});
            return;
        }else{
            const code = Math.floor((Math.random()*10000000));
            const token = new Token({
                email,
                code,
                expireAt: Date.now()+(5*60*1000)
            });
            token.save().then(()=>{
                const mailoptions = {
                    from: "noreply@lifewaygen.ga",
                    to:email,
                    subject: "Find you Username",
                    text: `Hello, Your verification code is : ${code}`,
                };
                transporter.sendMail(mailoptions,(err)=>{
                    if(err){
                        res.send({sendmail:false});
                    }else{
                        res.send({sendmail:true});
                    }
                });
            });
           
        }
    })

  
});

router.post("/finduser",(req:Request,res:Response)=>{
    const email= req.body.email;
    User.findOne({email},(err:Error,doc:IUser)=>{
    
        let auth = false;
        if(doc){
          auth = true; 
            const mailoptions = {
                from: "noreply@lifewaygen.ga",
                to:email,
                subject: "Find you Username",
                text: `Hello, This is your username : ${doc.userName}`,
            };

            
        const result =  transporter.sendMail(mailoptions, (error, responses) => {
          if(err){
              console.log(err);
          }
        });
        }
        res.send({auth})
    })
})

                
router.route("/findpassword")
.post((req:Request,res:Response)=>{
    console.log("Je;;?");
    const email= req.body.email;
    const userName= req.body.userName;

    User.findOne({userName,email},(err:Error,doc:IUser)=>{
    
        let auth = false;
        if(doc){
          auth = true; 
          const token = crypto.randomBytes(20).toString('hex');
          const data: IToken = new Token({
              userName,
              token,
              expireAt: Date.now() + (60*5*1000)
          });
          data.save().then(()=>{
            const mailoptions = {
                from: "noreply@lifewaygen.ga",
                to:email,
                subject: "Authenticate your Email",
                text: `Hello, please click this link to change the password: https://lifewaygen.ga/auth/reset/${token}`,
            };

            
        const result =  transporter.sendMail(mailoptions, (error, responses) => {
          if(err){
              console.log(err);
          }
        });
    })  
        }
        res.send({auth})
    })
})
.patch((req:Request,res:Response)=>{
    const {token,password} = req.body;
    console.log(token);

    Token.findOne({token},(err:Error,doc:IToken)=>{
        if(doc){
            console.log(doc);
            const userName = doc.userName;
            const {salt,hash} = genPassword(password);
            User.findOneAndUpdate({userName},{salt,hash},undefined,(err,doc)=>{
                if(err){
                    res.send({errMessage:"Sorry, fail to change the password. Try again"});
                }else{
                    Token.deleteOne({token}).then(()=>{
                        res.send({update:true});
                    });
                }
            })
        }else{
            res.send({istoken:false});
        }

    })

    
});

    

router.get('/findtoken/:token',(req:Request,res:Response)=>{
    const token = req.params.token;
    Token.findOne({token},(err:Error,doc:IToken)=>{
        if(doc){
            res.send({istoken:true});
        }else{
            res.send({istoken:false});

        }
    })
});

