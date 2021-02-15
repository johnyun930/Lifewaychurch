"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.db = function () {
    mongoose_1.default.connect(process.env.DB_PORT, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(function () { return console.log("Connected to MongoDB"); }).catch(function () {
        throw new Error("Mongo DB Error");
    });
};
