import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import multer from "multer";

import { env } from "../config/env.js";
import { AppError } from "../models/common/appError.js";

const ensureFolder = (folderName) => {
  if (!env.uploadFolders.includes(folderName)) {
    throw new AppError("Upload folder is not supported.", 400, "UPLOAD_FOLDER_INVALID");
  }

  const folderPath = path.join(env.uploadRoot, folderName);
  fs.mkdirSync(folderPath, { recursive: true });
  return folderPath;
};

const storage = multer.diskStorage({
  destination: (req, _file, callback) => {
    try {
      const folderPath = ensureFolder(req.params.folder);
      callback(null, folderPath);
    } catch (error) {
      callback(error);
    }
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${crypto.randomUUID()}${extension}`;
    callback(null, uniqueName);
  }
});

export const uploadSingleFile = multer({
  storage,
  limits: {
    fileSize: env.uploadMaxFileSize
  }
}).single("file");
