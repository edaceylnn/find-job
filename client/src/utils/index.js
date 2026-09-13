import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8800/api-v1";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    if (!error.response) {
      return {
        success: false,
        message:
          "API sunucusuna ulaşılamıyor. Backend'in çalıştığını ve API adresini kontrol et.",
      };
    }

    const err = error.response.data;
    console.log(err);
    return { success: err.success, status: err.success, message: err.message };
  }
};

// resourceType: "image" for photos, "raw" for non-image files like a CV PDF.
// Note the Cloudinary unsigned upload preset must itself allow the "raw"
// resource type for CV uploads to succeed.
export const handleFileUpload = async (uploadFile, resourceType = "image") => {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    console.error("Cloudinary ortam değişkenleri eksik.");
    return "";
  }

  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload/`,
      formData,
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const updateUrl = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
}) => {
  const params = new URLSearchParams();
  const hasValue = (value) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim() !== "";
    return Boolean(value);
  };

  if (pageNum && pageNum > 1) {
    params.set("page", pageNum);
  }

  if (hasValue(query)) {
    params.set("search", query);
  }

  if (hasValue(cmpLoc)) {
    params.set("location", cmpLoc);
  }

  if (hasValue(sort)) {
    params.set("sort", sort);
  }

  if (hasValue(jType)) {
    params.set("jtype", jType);
  }

  if (hasValue(exp)) {
    params.set("exp", exp);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
