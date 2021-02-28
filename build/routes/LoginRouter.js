"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = __importDefault(require("express"));
var passport_1 = __importDefault(require("passport"));
exports.router = express_1.default.Router();
exports.router.post('/', passport_1.default.authenticate('local', {
    failureRedirect: 'localhost:3000/'
}), function (req, res) {
    console.log(req.isAuthenticated());
});
