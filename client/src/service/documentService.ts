
import axios from "axios";

const API_URL = "https://documentor-ai.onrender.com";

const getAuthConfig = () => {
  if (typeof window === "undefined") {
    throw new Error("This API must be called from the browser");
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please login first");
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Route 1: Generate Cloudinary signature
export const getUploadSignature = async () => {
  const response = await axios.post(
    `${API_URL}/api/file/upload-signature`,
    {},
    getAuthConfig()
  );
  console.log(response.data);
  return response.data;
};

// Route 2: Confirm uploaded document
export const confirmUpload = async (payload: {
  publicId: string;
  title: string;
}) => {
  const response = await axios.post(
    `${API_URL}/api/file/confirm-upload`,
    payload,
    getAuthConfig()
  );


  return response.data;
};

// Route 3: Get logged-in user's documents
export const getMyDocuments = async () => {
  const response = await axios.get(
    `${API_URL}/api/file/documents`,
    getAuthConfig()
  );

  return response.data;
};

export const getDocumentPreview = async (
  documentId: string
): Promise<Blob> => {
  console.log("Preview Document ID:", documentId);

  const response = await axios.get(
    `${API_URL}/api/file/${documentId}/preview`,
    {
      ...getAuthConfig(),
      responseType: "blob",
    }
  );


  return response.data;
};


export const removeDocument = async (documentid: string) => {
 

  const response = await axios.delete(
    `${API_URL}/api/file/remove`,{
      data : {documentid},
      ...getAuthConfig()
    }
  )

  return response.data;
};