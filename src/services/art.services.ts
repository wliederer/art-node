import AWS, { S3 } from 'aws-sdk';

const accessKey = process.env.AWS_ACCESS_KEY_ID;
const secretKey = process.env.AWS_SECRET_KEY;
const bucket = process.env.S3_BUCKET;

const credentials = {
    accessKeyId: accessKey,
    secretAccessKey: secretKey,
}

AWS.config.update({...credentials,region:'us-east-2'})
const s3 = new AWS.S3({});

export const getBucket = async():Promise<any> => {
   const object = s3.getObject({Bucket:String(bucket),Key:"art/orange.jpeg"}).promise();
    const objectUrl = s3.getSignedUrlPromise('getObject',{Bucket:String(bucket),Key:"art/orange.jpeg"});
  const images =  s3.listObjects({Bucket:String(bucket)}).promise();

  await objectUrl.then(data =>{
      // console.log(data)
  }).catch(err=>{
      throw err
  })

  // await object.then(data=>{
  //     console.log(data)
  // }).catch(err=>{
  //     throw err;
  // });

  return await images.then((data)=>{
      console.log(data)
      return data;
  }).catch(err=>{
      console.log(err)
      throw err;
  })
   
}