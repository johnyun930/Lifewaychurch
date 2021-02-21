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
    .get(function (req, res) {
    UserSchema_1.User.find({}, function (err, doc) {
        console.log(doc);
    });
})
    .post(function (req, res) {
    var _a = req.body, userName = _a.userName, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
    var member = new UserSchema_1.User({
        userName: userName,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email
    });
    member.save().then(function () {
        console.log(member);
    }).catch(function () {
        console.log("err");
    });
})
    .patch(function (req, res) {
});
