import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
  })
  
export const upload = multer({ storage });

// export const uploadSingleFile = (fileName, req, res) => {
//   return new Promise((resolve, reject) => {
//       upload.single(fileName)(req, res, (err) => {
//           if (err) {
//             console.log("save err")
//               reject(err);  // Pass error to be handled in async/await
//           } else {
//             console.log("f pass")
//               resolve(req.file);  // Resolve with the uploaded file
//           }
//       });
//   });
// };