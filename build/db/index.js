"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.db = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.db = function () {
    mongoose_1.default.connect("mongodb://localhost:27017/" + process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(function () {
        console.log('connect to MongoDB');
    }).catch(function (err) {
        console.log(err);
    });
};
exports.connection = mongoose_1.default.createConnection("mongodb://localhost:27017/" + process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
