const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.S3_REGION || 'ap-northeast-2',
  endpoint: process.env.S3_ENDPOINT,
  credentials: process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY ? {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  } : undefined,
  forcePathStyle: true,
});

const BUCKET = process.env.S3_BUCKET || 'Document';

const uploadToS3 = async (file, folder) => {
  const key = `${folder}/${Date.now()}-${file.originalname}`;
  await s3Client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }));
  return `${s3Client.config.endpoint}/${BUCKET}/${key}`;
};

const streamFromS3 = async (key, res) => {
  const { Body } = await s3Client.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
  Body.pipe(res);
};

const extractKeyFromUrl = (url) => {
  const prefix = `${s3Client.config.endpoint}/${BUCKET}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
};

module.exports = { uploadToS3, streamFromS3, extractKeyFromUrl };
