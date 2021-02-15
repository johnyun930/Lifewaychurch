"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var UserSchema_1 = require("../schemas/UserSchema");
exports.router = express_1.default.Router();
exports.router.route('/')
    .post(function (req, res) {
    var member = new UserSchema_1.User({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    member.save().then(function () {
        console.log(member);
    }).catch(function () {
        console.log("err");
    });
})
    .patch(function (req, res) {
});
