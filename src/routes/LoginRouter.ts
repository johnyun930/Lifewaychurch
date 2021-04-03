import e from 'express';
import express,{Response,Request} from 'express';
import { Cookie, Session } from 'express-session';
import passport from 'passport';
import { BibleStudy, BulletenBoard, QT } from '../schemas/PostSchema';
import { BibleStudyReview, BulletenBoardReview, QTReview,ChildSchoolReview } from '../schemas/ReviewSchema';
import { IUser, User } from '../schemas/UserSchema';
export const router = express.Router();

export interface UserData {
  userName: string
  firstName: string
  lastName: string
  isAdmin: boolean

}

router.post('/',function(req, res, next) {
  console.log("Session id", req.body);
    passport.authenticate('local', function(err, user:IUser, info) {
      if (err) { return next(err); }
      if(user){
        console.log("req.user : "+ JSON.stringify(user));
        let userData: UserData = {
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
        }
        
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send(userData);
          });

      }else{
        res.send({
          errMessage:"Invaild username or password. Please try again"
        });
      }
    })(req, res, next);
});

router.delete('/:id',(req,res)=>{
  console.log("Account is deleting");
  const userName = req.params.id;
  User.findOneAndDelete({userName},{useFindAndModify:false},(err,doc)=>{
    if(err){
      console.log(err);
    }else{
       BulletenBoard.deleteMany({composer:userName});
      BulletenBoardReview.deleteMany({reviewer:userName});
      BibleStudyReview.deleteMany({reviewer:userName});
      QT.deleteMany({composer:userName});
      QTReview.deleteMany({reviewer:userName});
      ChildSchoolReview.deleteMany({reviewer:userName});
      req.session.destroy((err)=>{
        if(err){
                  throw err
            }
      
      });

      res.send({message: "Deleted the account successfully."});
    }
  })
})