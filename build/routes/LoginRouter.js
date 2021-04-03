"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var PostSchema_1 = require("../schemas/PostSchema");
var ReviewSchema_1 = require("../schemas/ReviewSchema");
var UserSchema_1 = require("../schemas/UserSchema");
exports.router = express_1.default.Router();
exports.router.post('/', function (req, res, next) {
    console.log("Session id", req.body);
    passport_1.default.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            console.log("req.user : " + JSON.stringify(user));
            var userData_1 = {
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                isAdmin: user.isAdmin,
            };
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.send(userData_1);
            });
        }
        else {
            res.send({
                errMessage: "Invaild username or password. Please try again"
            });
        }
    })(req, res, next);
});
exports.router.delete('/:id', function (req, res) {
    console.log("Account is deleting");
    var userName = req.params.id;
    UserSchema_1.User.findOneAndDelete({ userName: userName }, { useFindAndModify: false }, function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            PostSchema_1.BulletenBoard.deleteMany({ composer: userName });
            ReviewSchema_1.BulletenBoardReview.deleteMany({ reviewer: userName });
            ReviewSchema_1.BibleStudyReview.deleteMany({ reviewer: userName });
            PostSchema_1.QT.deleteMany({ composer: userName });
            ReviewSchema_1.QTReview.deleteMany({ reviewer: userName });
            ReviewSchema_1.ChildSchoolReview.deleteMany({ reviewer: userName });
            req.session.destroy(function (err) {
                if (err) {
                    throw err;
                }
            });
            res.send({ message: "Deleted the account successfully." });
        }
    });
});
