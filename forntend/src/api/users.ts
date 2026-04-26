import API from "./axios";

export const uploadProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await API.put("/users/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
