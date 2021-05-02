"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPassword = exports.upload = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var multer_1 = __importDefault(require("multer"));
var index_1 = require("./db/index");
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
var PostSchema_1 = require("./schemas/PostSchema");
var ReviewSchema_1 = require("./schemas/ReviewSchema");
exports.upload = multer_1.default({ dest: 'uploads/' });
var LocalStrategy = require('passport-local').Strategy;
index_1.db();
var corsOptions = {
    origin: "https://" + process.env.ORIGIN,
    //  origin:`http://${process.env.LOCAL}`,
    credentials: true,
    optionSuccessStatus: 200
};
var app = express_1.default();
console.log(__dirname);
app.use('/profile', express_1.default.static(__dirname + '/public/profile'));
app.use(cookie_parser_1.default());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(cors_1.default(corsOptions));
var store = connect_mongo_1.default.create({
    mongoUrl: "mongodb+srv://" + (process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD) + "@cluster0.umkpc.mongodb.net/" + process.env.DB_NAME
    // mongoUrl: `mongodb://localhost:27017/${process.env.DB_NAME}`
});
app.use(express_session_1.default({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        domain: '.lifewaygen.ga',
        //  domain:'localhost',
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
exports.validPassword = validPassword;
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
    var userName = user.userName, profile = user.profile, firstName = user.firstName, lastName = user.lastName, level = user.level;
    done(null, {
        userName: userName,
        firstName: firstName,
        lastName: lastName,
        profile: profile,
        level: level
    });
});
passport_1.default.deserializeUser(function (user, done) {
    console.log("deserializeUser", user);
    console.log("profile", user.profile);
    UserSchema_1.User.findOne({ userName: user.userName }, function (err, user) {
        done(err, user);
    });
});
app.use('/auth', UserRouter_1.router);
app.use('/login', LoginRouter_1.router);
app.use('/worship', WorshipRouter_1.router);
app.use('/biblestudy', BibleStudyRouter_1.router);
app.use('/qt', QTRouter_1.router);
app.use('/bulletenboard', BulletenBoardRouter_1.router);
app.use('/childschool', ChildSchoolRouter_1.router);
app.get('/', function (req, res) {
    if (req.session) {
        console.log(req.session.id);
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
app.get('/postcount/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var composer, reviewer, numofBS, numofBSReview, numofQT, numofQTReview, numofBTB, numofBTBReview, numofCS, numofCSReview, totalPost;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                composer = req.params.username;
                reviewer = composer;
                return [4 /*yield*/, PostSchema_1.BibleStudy.countDocuments({ composer: composer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 1:
                numofBS = _a.sent();
                return [4 /*yield*/, ReviewSchema_1.BibleStudyReview.countDocuments({ reviewer: reviewer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 2:
                numofBSReview = _a.sent();
                return [4 /*yield*/, PostSchema_1.QT.countDocuments({ composer: composer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 3:
                numofQT = _a.sent();
                return [4 /*yield*/, ReviewSchema_1.QTReview.countDocuments({ reviewer: reviewer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 4:
                numofQTReview = _a.sent();
                return [4 /*yield*/, PostSchema_1.BulletenBoard.countDocuments({ composer: composer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 5:
                numofBTB = _a.sent();
                return [4 /*yield*/, ReviewSchema_1.BulletenBoardReview.countDocuments({ reviewer: reviewer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 6:
                numofBTBReview = _a.sent();
                return [4 /*yield*/, PostSchema_1.ChildSchool.countDocuments({ composer: composer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 7:
                numofCS = _a.sent();
                return [4 /*yield*/, ReviewSchema_1.ChildSchoolReview.countDocuments({ reviewer: reviewer }, function (err) {
                        if (err) {
                            throw err;
                        }
                    })];
            case 8:
                numofCSReview = _a.sent();
                totalPost = numofBS + numofBTB + numofCS + numofQT;
                res.send({ numofBS: numofBS, numofBSReview: numofBSReview, numofQT: numofQT, numofQTReview: numofQTReview, numofCS: numofCS, numofCSReview: numofCSReview, numofBTB: numofBTB, numofBTBReview: numofBTBReview, totalPost: totalPost });
                return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT, function () {
    console.log("app is listening on Port 8000");
});
