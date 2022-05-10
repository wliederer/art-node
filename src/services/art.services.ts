import AWS, { S3 } from "aws-sdk";

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_KEY;
const bucket = process.env.S3_BUCKET;

const credentials = {
  accessKeyId: accessKey,
  secretAccessKey: secretKey,
};

AWS.config.update({ ...credentials, region: "us-east-2" });
const s3 = new AWS.S3({});

export const getBucket = async (): Promise<any> => {
  let signedUrls;
  const images = s3.listObjects({ Bucket: "billsart" }).promise();

  const awsObjects = await images
    .then(async (data: S3.ListObjectsOutput) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
  if (awsObjects.Contents) {
    signedUrls = awsObjects.Contents?.map(async (d, i) => {
      if (i != 0) {
        return await s3.getSignedUrlPromise("getObject", {
          Bucket: String(bucket),
          Key: d.Key,
        });
      }
    });
  }
  return signedUrls;
};

const getUrl = async (key: string) => {
  return s3.getSignedUrl("getObject", { Bucket: String(bucket), Key: key });
};
