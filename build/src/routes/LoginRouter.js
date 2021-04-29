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
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
var PostSchema_1 = require("../schemas/PostSchema");
var ReviewSchema_1 = require("../schemas/ReviewSchema");
var UserSchema_1 = require("../schemas/UserSchema");
exports.router = express_1.default.Router();
exports.router.post('/user', function (req, res) {
    var userName = req.body.userName;
    UserSchema_1.User.findOne({ userName: userName }, function (err, doc) {
        if (doc) {
            res.send(true);
        }
        else {
            res.send(false);
        }
    });
});
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
                profile: user.profile,
                level: user.level,
            };
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.send(userData_1);
            });
        }
        else {
            res.send({
                errMessage: "Invaild username or password. Please try again"
            });
        }
    })(req, res, next);
});
exports.router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userName;
    return __generator(this, function (_a) {
        console.log("Account is deleting");
        userName = req.params.id;
        UserSchema_1.User.findOneAndDelete({ userName: userName }, { useFindAndModify: false }, function (err, doc) { return __awaiter(void 0, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (err) {
                    console.log(err);
                }
                else {
                    removeAllData(userName).then(function (value) {
                        console.log(value);
                        req.session.destroy(function (err) {
                            if (err) {
                                throw err;
                            }
                        });
                        res.send({ message: "Deleted the account successfully." });
                    }).catch(function (err) {
                        if (err) {
                            throw err;
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); });
        return [2 /*return*/];
    });
}); });
function removeAllData(userName) {
    return Promise.all([PostSchema_1.BulletenBoard.deleteMany({ composer: userName }), ReviewSchema_1.BulletenBoardReview.deleteMany({ reviewer: userName }), ReviewSchema_1.BibleStudyReview.deleteMany({ reviewer: userName }),
        PostSchema_1.QT.deleteMany({ composer: userName }), ReviewSchema_1.QTReview.deleteMany({ reviewer: userName }), ReviewSchema_1.ChildSchoolReview.deleteMany({ reviewer: userName })
    ]).then(function (docs) {
        console.log(docs);
    });
}
