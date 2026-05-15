import path from "node:path";

import { env } from "../../config/env.js";

export const buildUploadResponse = (folder, file) => {
  const relativePath = path.posix.join("/uploads", folder, file.filename);

  return {
    originalName: file.originalname,
    fileName: file.filename,
    mimeType: file.mimetype,
    size: file.size,
    folder,
    relativePath,
    absolutePath: path.join(env.uploadRoot, folder, file.filename)
  };
};
