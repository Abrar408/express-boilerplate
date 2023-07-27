const { S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  endpoint: process.env.DO_SPACE_ENDPOINT,
  forcePathStyle: false, // Configures to use subdomain/virtual calling format.
  region: process.env.DO_SPACE_REGION,
  credentials: {
    accessKeyId: process.env.DO_SPACE_ACCESS_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET_KEY,
  },
});

module.exports = s3Client;
