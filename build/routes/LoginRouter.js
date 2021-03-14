"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
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
            console.log("/login fail!!!");
            res.send({
                errorMessage: "Invaild username or password. Please try again"
            });
        }
    })(req, res, next);
});
