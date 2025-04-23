

// import nodeMailer from "nodemailer";
// import getConfigs from "../config/config.js";

// const Configs = getConfigs();

// export const sendEmailQRCode = async (options) => {
//   const { qrCode, email, subject, id } = options;
//   const transporter = nodeMailer.createTransport({
//     host: Configs.mail.host,
//     port: Configs.mail.port,
//     auth: {
//       user: Configs.mail.userMail,
//       pass: Configs.mail.userPass,
//     },
//   });
//   const mailOptions = {
//     from: Configs.mail.userMail,
//     to: email,
//     subject: subject,
//     html: `<!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Event Pass QR Code</title>
// </head>
// <body>
//   <p>Dear Sir / Mam,</p>

//   <p>Excited for the upcoming event! Your personalized QR code is attached for quick access. Please ensure to scan it at the event for verification.</p>

//   <p>${process.env.APP_URL}?id=${id}</p>

//   <p>Looking forward to seeing you there!</p>
//   <p>Best regards,</p>
// </body>
// </html>`,
//     text: "Please find below the Event Pass Qr Code",
//     attachments: [
//       {
//         filename: "qrcode.png",
//         content: qrCode,
//         encoding: "base64",
//       },
//     ], // Use 'html' instead of 'text' for HTML content
//   };

//   await transporter.sendMail(mailOptions);
// };
// export const sendEmailGuest = async (
//   email,
//   subject,
//   // content,
//   html,
//   pdfFilePath,
//   filename
// ) => {
//   const transporter = nodeMailer.createTransport({
//     host: Configs.mail.host,
//     port: Configs.mail.port,
//     auth: {
//       user: Configs.mail.userMail,
//       pass: Configs.mail.userPass,
//     },
//   });
//   const mailOptions = {
//     from: Configs.mail.userMail,
//     to: email,
//     cc: "info@bcbaind.com",
//     subject: subject,
//     // text: content,
//     html: html,
//     attachments: [
//       {
//         filename: filename,
//         path: pdfFilePath,
//       },
//     ],
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log(`Error sending email: ${email}`);
//       console.error("Error sending email:", error);
//       return error;
//     } else {
//       console.log(`Email sent successfully. ${email}`);
//       return info;
//     }
//   });
// };

// export const sendOtpEmail = (email_id, content, subject) => {
//   const transporter = nodeMailer.createTransport({
//     host: Configs.mail.host,
//     port: Configs.mail.port,
//     auth: {
//       user: Configs.mail.userMail,
//       pass: Configs.mail.userPass,
//     },
//     debug: true,
//   });

//   var mailOptions = {
//     from: Configs.mail.userMail,
//     to: email_id,
//     subject: subject,
//     text: content,
//   };
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.error("Error sending email:", error);
//       return error;
//     } else {
//       console.log("Email sent successfully.");
//       return info;
//     }
//   });
// };
