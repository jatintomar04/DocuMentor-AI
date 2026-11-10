import crypto from "node:crypto";
import cloudinary from "../config/cloudinary.js";
import "dotenv/config"

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FORMATS = ["pdf", "docx", "txt"];

const createUploadSignature = (userId: string) => {
  const timestamp = Math.floor(Date.now() / 1000);

  const publicId = `documents/${userId}/${crypto.randomUUID()}`;

  const params = {
    timestamp,
    public_id: publicId,
    type: "authenticated",
    overwrite: false,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
    
  );

  return {
    timestamp,
    publicId,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    resourceType: "raw",
    maxBytes: MAX_FILE_SIZE,
    allowedFormats: ALLOWED_FORMATS,
    signedParams: params,
  };
};


const verifyUploadedAsset = async (publicId: string) => {
  const asset = await cloudinary.api.resource(publicId, {
    resource_type: "raw",
    type: "authenticated",
  });

  
  const filename = asset.public_id.split("/").pop() ?? "";
  const format = filename.split(".").pop()?.toLowerCase() ?? "";

  if (!ALLOWED_FORMATS.includes(format)) {
    throw new Error("Unsupported document format");
  }

  if (
    !Number.isSafeInteger(asset.bytes) ||
    asset.bytes <= 0 ||
    asset.bytes > MAX_FILE_SIZE
  ) {
    throw new Error("Invalid document size");
  }

  return {
    publicId: asset.public_id,
    bytes: asset.bytes,
    format,
  };
};


export  {createUploadSignature, verifyUploadedAsset}