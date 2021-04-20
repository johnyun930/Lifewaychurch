import nodemailer from "nodemailer";
import {google} from 'googleapis';
const OAuth2 = google.auth.OAuth2;


const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_PASSWORD,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

const accessToken = oauth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
         type: "OAuth2",
        user: process.env.NODEMAILER_USER,
         clientId: process.env.GOOGLE_CLIENT_ID,
         clientSecret:  process.env.GOOGLE_PASSWORD,
         refreshToken: process.env.REFRESH_TOKEN,
    //     accessToken: accessToken
     }
});



export default transporter;