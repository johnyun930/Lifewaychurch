import express,{Response,Request} from 'express';
import { Cookie, Session } from 'express-session';
import passport from 'passport';
import { IUser } from '../schemas/UserSchema';
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