const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  endpoint: 'https://hlobfaaxlqrisiesrmfa.storage.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: 'fd73d281d41a722ab15512c4aab6a5b0',
    secretAccessKey: 'f71f219e14952e78e0ec9b532ef4c5d95a594ebbef157ca65fa07221984d1fd9',
  },
  forcePathStyle: true,
});

const BUCKET = 'Document';

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
