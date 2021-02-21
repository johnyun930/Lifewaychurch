"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var db_1 = require("./db");
var cors_1 = __importDefault(require("cors"));
var UserRouter_1 = require("./routes/UserRouter");
var LoginRouter_1 = require("./routes/LoginRouter");
var WorshipRouter_1 = require("./routes/WorshipRouter");
var app = express_1.default();
db_1.db();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(cors_1.default());
app.use('/signup', UserRouter_1.router);
app.use('/login', LoginRouter_1.router);
app.use('/worship', WorshipRouter_1.router);
app.get('/', function (req, res) {
});
app.listen(process.env.PORT, function () {
    console.log("app is listening on Port 8000");
});
