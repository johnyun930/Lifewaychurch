"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var nodemailer_1 = __importDefault(require("nodemailer"));
var googleapis_1 = require("googleapis");
var OAuth2 = googleapis_1.google.auth.OAuth2;
var oauth2Client = new OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_PASSWORD, "https://developers.google.com/oauthplayground");
oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});
var accessToken = oauth2Client.getAccessToken();
var transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.NODEMAILER_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_PASSWORD,
        refreshToken: process.env.REFRESH_TOKEN,
    }
});
exports.default = transporter;
