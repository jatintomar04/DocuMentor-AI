
import axios from "axios";
import {
  getUploadSignature,
  confirmUpload,
} from "./documentService";

export const uploadDocument = async (file: File) => {
   try {
      if (file.type !== "application/pdf") {
    throw new Error("Please select a PDF file");
  }

  if (file.size === 0) {
    throw new Error("Selected file is empty");
  }

  // Step 1: Get signed upload details from backend
  const signatureData = await getUploadSignature();

  const {
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    publicId,
  } = signatureData;

  if (!signature || !timestamp || !apiKey || !cloudName) {
    throw new Error("Invalid Cloudinary signature response");
  }

  // Step 2: Upload PDF directly to Cloudinary
  const formData = new FormData();

formData.append("file", file);
formData.append("api_key", apiKey);
formData.append("timestamp", String(timestamp));
formData.append("signature", signature);
formData.append("public_id", publicId);
formData.append("type", "authenticated");
formData.append("overwrite", "false");

  if (folder) {
    formData.append("folder", folder);
  }

  if (publicId) {
    formData.append("public_id", publicId);
  }
  console.log(formData);
  const cloudinaryResponse = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    formData
  );
  //  console.log("Cloudinary upload success:", cloudinaryResponse.data);

  // Step 3: Confirm upload with backend
  return await confirmUpload({
    publicId: cloudinaryResponse.data.public_id,
    title: file.name,
  });
   } catch (error) {
    console.log(error);
   }
};
