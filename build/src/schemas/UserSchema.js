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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = exports.User = exports.SessionSchema = exports.UserSchema = void 0;
var mongoose_1 = __importStar(require("mongoose"));
exports.UserSchema = new mongoose_1.Schema({
    userName: { type: String, required: true, unique: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    profile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    level: { type: Number, required: true }
});
exports.SessionSchema = new mongoose_1.Schema({
    _id: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
    sessions: {
        cookie: {
            maxAge: Number,
            expires: Date,
            secure: Boolean,
            path: String,
        },
        passport: {
            user: String
        }
    }
});
exports.User = mongoose_1.default.model('User', exports.UserSchema);
exports.Session = mongoose_1.default.model('Session', exports.SessionSchema);
