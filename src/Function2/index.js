const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = new S3Client();

exports.handler = async (event) => {
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));
    
    const { Body, ContentType } = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
    
    const date = new Date();
    const partition = `data/year=${date.getFullYear()}/month=${date.getMonth() + 1}/day=${date.getDate()}/`;
    
    await s3.send(new PutObjectCommand({
      Bucket: process.env.PROCESSED_BUCKET_NAME,
      Key: partition + key,
      Body,
      ContentType: ContentType || "application/octet-stream"
    }));
  }
};
