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
var mailer_1 = __importDefault(require("../auth/mailer"));
var Auth_1 = require("../schemas/Auth");
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
    .post(function (req, res, next) {
    var _a = req.body, code = _a.code, userName = _a.userName, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, email = _a.email;
    Auth_1.Token.findOne({ email: email, code: code }, function (err, doc) {
        if (doc) {
            var saltHash = genPassword(password);
            var isAdmin = false;
            var salt = saltHash.salt;
            var hash = saltHash.hash;
            var member_1 = new UserSchema_1.User({
                userName: userName,
                salt: salt,
                hash: hash,
                firstName: firstName,
                lastName: lastName,
                email: email,
                isAdmin: isAdmin
            });
            member_1.save().then(function () {
                console.log("successto save");
                var userData = {
                    userName: member_1.userName,
                    firstName: member_1.firstName,
                    lastName: member_1.lastName,
                    isAdmin: member_1.isAdmin,
                };
                Auth_1.Token.deleteOne({ email: email, code: code }, undefined, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                req.logIn(member_1, function (err) {
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
        }
        else {
            res.send({ errMessage: "Sorry, try again. If you sent the code before 5min, resend the code please" });
        }
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
exports.router.post('/email', function (req, res) {
    var email = req.body.email;
    UserSchema_1.User.findOne({ email: email }, function (err, doc) {
        if (doc) {
            res.send({ errMessage: "This email is existed. Please use another email" });
            return;
        }
        else {
            var code_1 = Math.floor((Math.random() * 10000000));
            var token = new Auth_1.Token({
                email: email,
                code: code_1,
                expireAt: Date.now() + (5 * 60 * 1000)
            });
            token.save().then(function () {
                var mailoptions = {
                    from: "noreply@lifewaygen.ga",
                    to: email,
                    subject: "Find you Username",
                    text: "Hello, Your verification code is : " + code_1,
                };
                mailer_1.default.sendMail(mailoptions, function (err) {
                    if (err) {
                        res.send({ sendmail: false });
                    }
                    else {
                        res.send({ sendmail: true });
                    }
                });
            });
        }
    });
});
exports.router.post("/finduser", function (req, res) {
    var email = req.body.email;
    UserSchema_1.User.findOne({ email: email }, function (err, doc) {
        var auth = false;
        if (doc) {
            auth = true;
            var mailoptions = {
                from: "noreply@lifewaygen.ga",
                to: email,
                subject: "Find you Username",
                text: "Hello, This is your username : " + doc.userName,
            };
            var result = mailer_1.default.sendMail(mailoptions, function (error, responses) {
                if (err) {
                    console.log(err);
                }
            });
        }
        res.send({ auth: auth });
    });
});
exports.router.route("/findpassword")
    .post(function (req, res) {
    console.log("Je;;?");
    var email = req.body.email;
    var userName = req.body.userName;
    UserSchema_1.User.findOne({ userName: userName, email: email }, function (err, doc) {
        var auth = false;
        if (doc) {
            auth = true;
            var token_1 = crypto_1.default.randomBytes(20).toString('hex');
            var data = new Auth_1.Token({
                userName: userName,
                token: token_1,
                expireAt: Date.now() + (60 * 5 * 1000)
            });
            data.save().then(function () {
                var mailoptions = {
                    from: "noreply@lifewaygen.ga",
                    to: email,
                    subject: "Authenticate your Email",
                    text: "Hello, please click this link to change the password: https://lifewaygen.ga/auth/reset/" + token_1,
                };
                var result = mailer_1.default.sendMail(mailoptions, function (error, responses) {
                    if (err) {
                        console.log(err);
                    }
                });
            });
        }
        res.send({ auth: auth });
    });
})
    .patch(function (req, res) {
    var _a = req.body, token = _a.token, password = _a.password;
    console.log(token);
    Auth_1.Token.findOne({ token: token }, function (err, doc) {
        if (doc) {
            console.log(doc);
            var userName = doc.userName;
            var _a = genPassword(password), salt = _a.salt, hash = _a.hash;
            UserSchema_1.User.findOneAndUpdate({ userName: userName }, { salt: salt, hash: hash }, undefined, function (err, doc) {
                if (err) {
                    res.send({ errMessage: "Sorry, fail to change the password. Try again" });
                }
                else {
                    Auth_1.Token.deleteOne({ token: token }).then(function () {
                        res.send({ update: true });
                    });
                }
            });
        }
        else {
            res.send({ istoken: false });
        }
    });
});
exports.router.get('/findtoken/:token', function (req, res) {
    var token = req.params.token;
    Auth_1.Token.findOne({ token: token }, function (err, doc) {
        if (doc) {
            res.send({ istoken: true });
        }
        else {
            res.send({ istoken: false });
        }
    });
});
