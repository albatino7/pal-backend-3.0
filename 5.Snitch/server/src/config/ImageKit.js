import ImagekitIO, { toFile } from "@imagekit/nodejs";

import { config } from "./config.js";

export const imagekitio = new ImagekitIO({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

export const imageUpload = async ({ buffer, filename }) => {
  // console.log(buffer, filename);
  const resultFile = await imagekitio.files.upload({
    file: await toFile(buffer),
    fileName: filename,
  });

  // console.log("Response of imageKit ", resultFile);
  return resultFile.url;
};
