import express,{Response,Request} from 'express';
import passport from 'passport';
export const router = express.Router();

router.post('/', passport.authenticate('local',{
    failureRedirect:'localhost:3000/'
}),
function(req, res) {
    console.log(req.isAuthenticated());
});