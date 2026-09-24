import ImagekitIO from "@imagekit/nodejs";

import { config } from "./config.js";

export const imagekitio = new ImagekitIO({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});
