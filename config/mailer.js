// const nodemailer = require("nodemailer");
// const { google } = require("googleapis");

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

// const oAuth2Client = new google.auth.OAuth2(
//   CLIENT_ID,
//   CLIENT_SECRET,
//   REDIRECT_URI
// );
// oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// const sendMail = async (to, subject, html) => {
//   const accessToken = await oAuth2Client.getAccessToken();

//   var transporter = nodemailer.createTransport({
//     service: "gmail",
//     secure: false,
//     // auth: {
//     //   user: process.env.MAIL_ADDRESS,
//     //   pass: process.env.MAIL_PASSWORD,
//     // },
//     auth: {
//       type: "OAuth2",
//       user: process.env.MAIL_ADDRESS,
//       clientId: CLIENT_ID,
//       clientSecret: CLIENT_SECRET,
//       refreshToken: REFRESH_TOKEN,
//       accessToken: accessToken,
//     },
//     // tls: {
//     //   rejectUnauthorized: false,
//     // },
//   });

//   var mailOptions = {
//     from: process.env.MAIL_ADDRESS,
//     to: to,
//     subject,
//     // text: `Hi Smartherd, thank you for your nice Node.js tutorials.
//     //         I will donate 50$ for this course. Please send me payment options.`,
//     html: html,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log(error);
//     } else {
//       console.log("Email sent: " + info.response);
//     }
//   });
// };

// module.exports = {
//   sendMail,
// };
