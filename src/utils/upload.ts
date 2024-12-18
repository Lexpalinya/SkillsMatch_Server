import cloudinary from "../config/cloudinary.config";

// Upload Image Function
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
        folder:"testSM"
      });

      resolve(cloudinaryUpload.url);
    } catch (error) {
      reject(error);
    }
  });
};

// Remove Image Function
export const RemoveImage = (url: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("url", url);
      // Extract public_id from the URL
      const splitUrl = url.split("/");
      console.log("splitUrl:", splitUrl);

      const imgIdWithExt = splitUrl[splitUrl.length - 1]; // Last part of the URL
      const imgFolder = splitUrl[splitUrl.length - 2]; // Second-to-last part for folder
      const imgId = `${imgFolder}/${imgIdWithExt.split(".")[0]}`; // Construct public_id
      console.log("img_id:", imgId);

      // Cloudinary delete
      const result = await cloudinary.uploader.destroy(imgId);
      console.log("result", result);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
