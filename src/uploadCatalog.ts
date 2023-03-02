import * as AWS from "aws-sdk";
import { PassThrough } from "stream";

const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
AWS.config.credentials = credentials;
AWS.config.update({ region: "us-east-1" });

const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

const music = new AWS.Music({ apiVersion: "2018-09-01" });

const uploadCatalog = async () => {
  const catalogFile = "myCatalog.json"; // Replace with your file name
  const s3Bucket = "myBucket"; // Replace with your bucket name

  /* const s3Params = {
    Bucket: s3Bucket,
    Key: catalogFile,
  }; */

  // Upload catalog file to S3
  const pass = new PassThrough();
  const uploadParams = { Bucket: s3Bucket, Key: catalogFile, Body: pass };
  await s3.upload(uploadParams).promise();

  // Import catalog from S3 to Alexa Music
  const importParams = {
    catalogId: "myCatalog", // Replace with your catalog ID
    contentType: "JSON",
    s3Bucket: s3Bucket,
    s3Url: `s3://${s3Bucket}/${catalogFile}`,
  };
  const importResponse = await music.importCatalog(importParams).promise();

  console.log(`Import started with job ID: ${importResponse.jobId}`);
};

uploadCatalog();
