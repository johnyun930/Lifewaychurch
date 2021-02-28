import express,{Response,Request} from 'express';
import passport from 'passport';
export const router = express.Router();

router.post('/', passport.authenticate('local',{
    failureRedirect: passport.
}),
function(req, res) {
    console.log(req.isAuthenticated());
});