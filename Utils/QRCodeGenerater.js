// import QRCode from "qrcode";
// import { createCanvas, loadImage } from "canvas";
// import QrCodeWithLogo from "qrcode-with-logos";

// const generateQR = async (text, center_image, width, cwidth) => {
//   // return new Promise((resolve, reject) => {
//   //   QRCode.toBuffer(
//   //     text,
//   //     {
//   //       errorCorrectionLevel: "H",
//   //       type: "png",
//   //     },
//   //     function (err, data) {
//   //       if (err) {
//   //         console.error(err);
//   //         reject(err);
//   //       } else {
//   //       //   console.log(data);
//   //         resolve(data);
//   //       }
//   //     }
//   //   );
//   // });

//   const canvas = createCanvas(width, width);
//   QRCode.toCanvas(
//     canvas,
//     text,
//     {
//       errorCorrectionLevel: "H",
//       margin: 1,
//       color: {
//         dark: "#000000",
//         light: "#ffffff",
//       },
//     }
//   );

//   const ctx = canvas.getContext("2d");
//   const img = await loadImage(center_image);
//   const center = (width - cwidth) / 2;
//   ctx.drawImage(img, center, center, cwidth, cwidth);
//   return canvas.toDataURL("image/png");
// };

// export default generateQR;

// // const generateQR = async () => {
// //   const logoResponse = await fetch(logoUrl);
// //   const logoBuffer = await logoResponse.buffer();

// //   // Create a canvas for QR code generation
// //   const canvas = createCanvas(width, width);

// //   // Create QR code with logo
// //   const qrcode = new QrCodeWithLogo({
// //     canvas,
// //     content: text,
// //     width: width,
// //     logo: {
// //       buffer: logoBuffer
// //     }
// //   });

// //   // Generate the QR code
// //   await qrcode.draw();

// //   // Convert the canvas to a Data URL
// //   const dataUrl = canvas.toDataURL();

// //   return dataUrl;
// // };

// // export default generateQR;

import QRCode from "qrcode";

const generateQR = async (text) => {
  var opts = {
    errorCorrectionLevel: "H",
    type: "image/png",
    margin: 0,
  };
  return new Promise((resolve, reject) => {
    QRCode.toDataURL(text, opts, function (err, url) {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

export default generateQR;
