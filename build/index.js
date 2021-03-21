"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var multer_1 = __importDefault(require("multer"));
var db_1 = require("./db");
var cors_1 = __importDefault(require("cors"));
var UserRouter_1 = require("./routes/UserRouter");
var LoginRouter_1 = require("./routes/LoginRouter");
var WorshipRouter_1 = require("./routes/WorshipRouter");
var BibleStudyRouter_1 = require("./routes/BibleStudyRouter");
var QTRouter_1 = require("./routes/QTRouter");
var ChildSchoolRouter_1 = require("./routes/ChildSchoolRouter");
var BulletenBoardRouter_1 = require("./routes/BulletenBoardRouter");
var passport_1 = __importDefault(require("passport"));
var crypto_1 = __importDefault(require("crypto"));
var express_session_1 = __importDefault(require("express-session"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var UserSchema_1 = require("./schemas/UserSchema");
exports.upload = multer_1.default({ dest: 'uploads/' });
var LocalStrategy = require('passport-local').Strategy;
db_1.db();
var corsOptions = {
    // origin:`https://${process.env.ORIGIN}`,
    origin: "http://" + process.env.LOCAL,
    credentials: true,
    optionSuccessStatus: 200
};
var app = express_1.default();
app.use(cookie_parser_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors_1.default(corsOptions));
var store = connect_mongo_1.default.create({
    // mongoUrl: `mongodb+srv://${process.env.DB_USERNAME+":"+process.env.DB_PASSWORD}@cluster0.umkpc.mongodb.net/${process.env.DB_NAME}`
    mongoUrl: "mongodb://localhost:27017/" + process.env.DB_NAME
});
app.use(express_session_1.default({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        // domain:'.lifewaygen.ga',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000
    }
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
function validPassword(password, hash, salt) {
    var hashVerify = crypto_1.default.pbkdf2Sync(password, salt, parseInt(process.env.LOOP), 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
passport_1.default.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
}, function (userName, password, cb) {
    console.log("Passport local");
    UserSchema_1.User.findOne({ userName: userName }).then(function (user) {
        if (user) {
            console.log(1);
            var isValid = validPassword(password, user.hash, user.salt);
            if (isValid) {
                console.log(2);
                return cb(null, user);
            }
            else {
                console.log(3);
                return cb(null, false, { message: 'Incorrect password.' });
            }
        }
        else {
            console.log(4);
            return cb(null, false, { message: 'Incorrect username.' });
        }
    }).catch(function (err) {
        cb(err);
    });
}));
passport_1.default.serializeUser(function (user, done) {
    var userName = user.userName, firstName = user.firstName, lastName = user.lastName, isAdmin = user.isAdmin;
    done(null, {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        isAdmin: isAdmin
    });
});
passport_1.default.deserializeUser(function (user, done) {
    console.log("deserializeUser", user);
    UserSchema_1.User.findOne({ userName: user.userName }, function (err, user) {
        done(err, user);
    });
});
app.use('/signup', UserRouter_1.router);
app.use('/login', LoginRouter_1.router);
app.use('/worship', WorshipRouter_1.router);
app.use('/biblestudy', BibleStudyRouter_1.router);
app.use('/qt', QTRouter_1.router);
app.use('/bulletenboard', BulletenBoardRouter_1.router);
app.use('/childschool', ChildSchoolRouter_1.router);
app.get('/', function (req, res) {
    console.log("first");
    if (req.session) {
        res.send(req.session);
    }
    else {
        res.send();
    }
});
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            throw err;
        }
        else {
            res.send({ message: "Successfully logged out" });
        }
    });
});
app.listen(process.env.PORT, function () {
    console.log("app is listening on Port 8000");
});
