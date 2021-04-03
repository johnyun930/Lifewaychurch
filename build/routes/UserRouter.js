"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var UserSchema_1 = require("../schemas/UserSchema");
var crypto_1 = __importDefault(require("crypto"));
var __1 = require("..");
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
        console.log(err);
        res.send({ errorMessage: "It is existed " + Object.keys(err.keyValue) + ". Please use another " + Object.keys(err.keyValue) + ". " });
    });
})
    .patch(function (req, res, next) {
    var _a = req.body, userName = _a.userName, newPassword = _a.newPassword, password = _a.password, firstName = _a.firstName, lastName = _a.lastName;
    if (password === undefined) {
        UserSchema_1.User.findOneAndUpdate({ userName: userName }, { firstName: firstName, lastName: lastName }, { returnOriginal: false, useFindAndModify: false }, function (err, doc) {
            if (err) {
                res.send({ errMessage: "Sorry, Please try again" });
            }
            else if (doc) {
                req.logIn(doc, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(doc);
                        var userData_1 = {
                            userName: doc.userName,
                            firstName: doc.firstName,
                            lastName: doc.lastName,
                            isAdmin: doc.isAdmin,
                        };
                        req.logIn(doc, function (err) {
                            if (err) {
                                return next(err);
                            }
                            return res.send(userData_1);
                        });
                    }
                });
            }
        });
    }
    else {
        UserSchema_1.User.findOne({ userName: userName }).then(function (user) {
            if (user) {
                var isValid = __1.validPassword(password, user.hash, user.salt);
                if (isValid) {
                    var saltHash = genPassword(newPassword);
                    var salt = saltHash.salt;
                    var hash = saltHash.hash;
                    UserSchema_1.User.findOneAndUpdate({ userName: userName }, { salt: salt, hash: hash }, { returnOriginal: false, useFindAndModify: false }, function (err, doc) {
                        if (err) {
                            res.send({ errMessage: "Sorry, update failed" });
                        }
                        else {
                            req.session.destroy(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    res.send({ message: "Password changed Successfully" });
                                }
                            });
                        }
                    });
                }
                else {
                    res.send({ errMessage: "Sorry password was wrong, please try again" });
                }
            }
        });
    }
});
