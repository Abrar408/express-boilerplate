const multer = require("multer");
const { genericResponse } = require("../constants/responses");
const storage = multer.memoryStorage();
const limits = { fileSize: 10 * 1024 * 1024 }; // Allow up to 10 MB per file
function uploadMiddleware(req, res, next) {
  const upload = multer({
    storage,
    limits,
  }).fields([{ name: "profilePicture", maxCount: 1 }]);

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        err.message =
          "Unable to upload image. Make sure that only allowed key name is used and only one file is uploaded at a time.";
        const response = genericResponse(400, false, null, err.message);
        return res.status(response.status.code).json(response);
      } else if (err.code === "LIMIT_FILE_SIZE") {
        err.message = "Unable to upload image.Max file size limit is 10MB.";
        const response = genericResponse(400, false, null, err.message);
        return res.status(response.status.code).json(response);
      }
      // A Multer error occurred when uploading.
    } else if (err) {
      // An unknown error occurred when uploading.
      const response = genericResponse(500, false, null, err.message);
      return res.status(response.status.code).json(response);
    }
    // Everything went fine.
    next();
  });
}
module.exports = uploadMiddleware;
