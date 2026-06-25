const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const hasS3Config = !!(process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY && process.env.S3_ENDPOINT);

let s3Client;
let BUCKET;

if (hasS3Config) {
  s3Client = new S3Client({
    region: process.env.S3_REGION || 'ap-northeast-2',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
  });
  BUCKET = process.env.S3_BUCKET || 'Document';
}

const uploadToS3 = async (file, folder) => {
  if (!hasS3Config) {
    const filename = `${folder}/${Date.now()}-${file.originalname}`;
    const filepath = path.join(__dirname, '..', 'uploads', filename);
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, file.buffer);
    return `/uploads/${filename}`;
  }

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
  const filepath = path.join(__dirname, '..', 'uploads', key);
  if (fs.existsSync(filepath)) {
    return fs.createReadStream(filepath).pipe(res);
  }
  if (!hasS3Config) {
    throw new Error('Receipt file not found');
  }
  const { Body } = await s3Client.send(new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
  }));
  Body.pipe(res);
};

const extractKeyFromUrl = (url) => {
  if (!hasS3Config) {
    if (url.startsWith('/uploads/')) {
      return url.replace('/uploads/', '');
    }
    return null;
  }
  const prefix = `${s3Client.config.endpoint}/${BUCKET}/`;
  return url.startsWith(prefix) ? url.slice(prefix.length) : null;
};

module.exports = { uploadToS3, streamFromS3, extractKeyFromUrl };
