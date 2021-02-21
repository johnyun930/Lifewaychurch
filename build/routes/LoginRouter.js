"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var UserSchema_1 = require("../schemas/UserSchema");
exports.router = express_1.default.Router();
exports.router.post('/', function (req, res) {
    UserSchema_1.User.findOne({ userName: req.body.userName }, function (err, data) {
        console.log("logging");
        if (data) {
            if (req.body.password === data.password) {
                console.log("log in");
                res.redirect('/');
            }
            else {
                res.send("Id or Password is wrong");
            }
        }
    });
});
