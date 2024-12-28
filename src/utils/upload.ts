import cloudinary from "../config/cloudinary.config";

/**
 * Uploads an image to Cloudinary.
 * @param img - The image file to upload.
 * @returns A promise that resolves to the URL of the uploaded image.
 */
export const UploadImage = (img: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await img.arrayBuffer();
      const base64String = Buffer.from(arrayBuffer).toString("base64");
      const imgPath = `data:${img.type};base64,${base64String}`;

      // Cloudinary upload
      const cloudinaryUpload = await cloudinary.uploader.upload(imgPath, {
        public_id: `IMG_${Date.now()}`,
        resource_type: "image",
        format: "webp",
        folder: "testSM",
      });

      resolve(cloudinaryUpload.url);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Removes an image from Cloudinary.
 * @param url - The URL of the image to remove.
 * @returns A promise that resolves when the image is removed.
 */
export const RemoveImage = (url: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Extract public_id from the URL
      const splitUrl = url.split("/");

      const imgIdWithExt = splitUrl[splitUrl.length - 1]; // Last part of the URL
      const imgFolder = splitUrl[splitUrl.length - 2]; // Second-to-last part for folder
      const imgId = `${imgFolder}/${imgIdWithExt.split(".")[0]}`; // Construct public_id

      // Cloudinary delete
      const result = await cloudinary.uploader.destroy(imgId);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
