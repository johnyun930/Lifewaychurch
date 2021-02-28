"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importStar(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var body_parser_1 = __importDefault(require("body-parser"));
var db_1 = require("./db");
var cors_1 = __importDefault(require("cors"));
var UserRouter_1 = require("./routes/UserRouter");
var LoginRouter_1 = require("./routes/LoginRouter");
var WorshipRouter_1 = require("./routes/WorshipRouter");
var passport_1 = __importDefault(require("passport"));
var crypto_1 = __importDefault(require("crypto"));
var express_session_1 = __importDefault(require("express-session"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var connect_flash_1 = __importDefault(require("connect-flash"));
var UserSchema_1 = require("./schemas/UserSchema");
var LocalStrategy = require('passport-local').Strategy;
var app = express_1.default();
db_1.db();
app.use(cookie_parser_1.default());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use(express_session_1.default({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({
        mongoUrl: "mongodb://localhost:27017/" + process.env.DB_NAME,
        crypto: {
            secret: process.env.SECRET
        },
        ttl: 1209600
    }),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(connect_flash_1.default());
app.use('/signup', UserRouter_1.router);
app.use('/login', LoginRouter_1.router);
app.use('/worship', WorshipRouter_1.router);
function validePassword(password, hash, salt) {
    var hashVerify = crypto_1.default.pbkdf2Sync(password, salt, parseInt(process.env.LOOP), 64, 'sha512').toString('hex');
    return hash === hashVerify;
}
passport_1.default.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
}, function (userName, password, cb) {
    UserSchema_1.User.findOne({ userName: userName }).then(function (user) {
        if (user) {
            console.log(1);
            var isValid = validePassword(password, user.hash, user.salt);
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
            return express_1.response.send('/');
        }
    }).catch(function (err) {
        cb(err);
    });
}));
passport_1.default.serializeUser(function (req, user, done) {
    done(undefined, user);
});
passport_1.default.deserializeUser(function (id, done) {
    UserSchema_1.User.findById(id, function (err, user) {
        done(err, user.id);
    });
});
app.get('/', function (req, res) {
});
app.listen(process.env.PORT, function () {
    console.log("app is listening on Port 8000");
});
