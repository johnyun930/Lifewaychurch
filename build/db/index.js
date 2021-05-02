"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
exports.db = function () {
    //      mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`, {useNewUrlParser: true, useUnifiedTopology: true,useCreateIndex: true}).then(()=>{
    //     console.log('connect to MongoDB');
    // }).catch((err)=>{
    //     console.log(err);
    // });
    mongoose_1.default.connect("mongodb+srv://" + (process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD) + "@cluster0.umkpc.mongodb.net/" + process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(function () {
        console.log('connect to MongoDB');
    }).catch(function (err) {
        console.log(err);
    });
};
