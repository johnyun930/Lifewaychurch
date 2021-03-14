"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var UserSchema_1 = require("../schemas/UserSchema");
var crypto_1 = __importDefault(require("crypto"));
exports.router = express_1.default.Router();
function genPassword(password) {
    var salt = crypto_1.default.randomBytes(32).toString('hex');
    var genHash = crypto_1.default.pbkdf2Sync(password, salt, parseInt(process.env.LOOP), 64, 'sha512').toString('hex');
    return {
        salt: salt,
        hash: genHash
    };
}
exports.router.route('/')
    .get(function (req, res) {
    UserSchema_1.User.find({}, function (err, doc) {
        console.log(doc);
    });
})
    .post(function (req, res, next) {
    var _a = req.body, userName = _a.userName, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
    var saltHash = genPassword(password);
    var isAdmin = false;
    var salt = saltHash.salt;
    var hash = saltHash.hash;
    var member = new UserSchema_1.User({
        userName: userName,
        salt: salt,
        hash: hash,
        firstName: firstName,
        lastName: lastName,
        email: email,
        isAdmin: isAdmin
    });
    member.save().then(function () {
        console.log("successto save");
        var userData = {
            userName: member.userName,
            firstName: member.firstName,
            lastName: member.lastName,
            isAdmin: member.isAdmin,
        };
        req.logIn(member, function (err) {
            if (err) {
                return next(err);
            }
            return res.send(userData);
        });
    })
        .catch(function (err) {
        res.send({ errorMessage: "It is existed " + Object.keys(err.keyValue) + ". Please use another " + Object.keys(err.keyValue) + ". " });
    });
})
    .patch(function (req, res) {
});
