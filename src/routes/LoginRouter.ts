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
  sessionId: string
  cookie: Cookie

}

router.post('/',function(req, res, next) {
  console.log("Session id", req.session.id);
    passport.authenticate('local', function(err, user:IUser, info) {
      if (err) { return next(err); }
      if(user){
        console.log("req.user : "+ JSON.stringify(user));
        let userData: UserData = {
          userName: user.userName,
          firstName: user.firstName,
          lastName: user.lastName,
          isAdmin: user.isAdmin,
          sessionId: req.session.id,
          cookie: req.session.cookie
        }
        
        req.logIn(user, function(err) {
            if (err) { return next(err); }
            return res.send(userData);
          });

      }else{
        console.log("/login fail!!!");
        res.send({
          errorMessage:"Invaild username or password. Please try again"
        });
      }
    })(req, res, next);
});