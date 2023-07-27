const sharp = require("sharp");

const sizes = [
  { quality: "low", factor: 200 },
  { quality: "medium", factor: 50 },
  { quality: "high", factor: 10 },
];

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();

  const file = req.files[Object.keys(req.files)[0]][0];
  req.files = [{ resolution: "original", image: file }];

  let originalWidth;
  let originalHeight;

  await sharp(file.buffer)
    .metadata()
    .then((metadata) => {
      originalWidth = +metadata.width;
      originalHeight = +metadata.height;
    });

  const resizePromises = sizes.map(async (size, index) => {
    const resizedImage = await sharp(file.buffer)
      .resize(
        Math.round(originalWidth / size.factor),
        Math.round(originalHeight / size.factor)
      )
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    const newFilename = `${file.originalname}_${Math.round(
      originalWidth / size.factor
    )}x${Math.round(originalHeight / size.factor)}.jpeg`;

    const resizedFile = {
      fieldname: file.fieldname,
      originalname: newFilename,
      encoding: file.encoding,
      mimetype: "image/jpeg",
      buffer: resizedImage,
      size: resizedImage.length,
    };
    req.files.push({
      resolution: size.quality,
      image: resizedFile,
    });
  });

  await Promise.all(resizePromises)
    .then(() => {
      next();
    })
    .catch((err) => {
      console.log("Error resizing images:", err);
      next();
    });
};

module.exports = resizeImages;
