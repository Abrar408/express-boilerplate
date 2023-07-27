const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../config/dospaces.config");
const { genericResponse } = require("../constants/responses");

const uploadFiles = (req, res, next) => {
  let files = req?.files;

  // --- use this code if resize image middleware is not being used ---
  if (!files || Object.keys(files).length === 0) {
    const response = genericResponse(400, false, null, "No files to upload");
    return res.status(response.status.code).json(response);
  }
  files = [req.files[Object.keys(req.files)[0]][0]];

  // --- use this code if resize image middleware is being used ---
  // if (!files || files.length === 0) {
  //   const response = genericResponse(400, false, null, "No files to upload");
  //   return res.status(response.status.code).json(response);
  // }
  req.imageUrl = [];

  const uploadPromises = files.map((file) => {
    const Image = file?.image || file; // checking if resize middleware is being used

    const filename = `${process.env.PROJECT_NAME}/${
      Image.fieldname
    }/${Date.now()}-${Image.originalname.replace(/ /g, "")}`;

    // if resize middleware is being used return an object else return the url only
    if (file?.image) {
      req.imageUrl.push({
        resolution: `${file.resolution || "original"}`,
        url: `${process.env.DO_OBJECT_URL}${filename}`,
      });
    } else {
      req.imageUrl = `${process.env.DO_OBJECT_URL}${filename}`;
    }

    const params = {
      Bucket: process.env.DO_SPACE_BUCKET,
      Key: filename,
      Body: Image.buffer,
      ACL: "public-read",
    };

    const uploadObject = () => {
      return new Promise((resolve, reject) => {
        s3Client
          .send(new PutObjectCommand(params))
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            console.log("Error", err);
            reject(err);
          });
      });
    };

    return uploadObject();
  });

  Promise.all(uploadPromises)
    .then(() => {
      next();
    })
    .catch((err) => {
      const response = genericResponse(500, false, null, true, err);
      return res.send(response);
    });
};

module.exports = uploadFiles;
