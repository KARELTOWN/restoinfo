import {
  S3Client,
  ListBucketsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { configDotenv } from "dotenv";
import { randomUUID } from "crypto";
import multerS3 from "multer-s3";
import multer from "multer";
import path from "path";
import { __dirname } from "../index.js";
import FileRestaurant from "../models/FileRestaurant.js";
import Restaurant from "../models/Restaurant.js";
import { Schema, SchemaType } from "mongoose";
import FileAvis from "../models/FileAvis.js";
configDotenv();

// upload file in local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join(__dirname, "public/files");
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Upload file user on S3
const clientS3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadFileUser = multer({
  storage: multerS3({
    s3: clientS3,
    bucket: process.env.AWS_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      const sanitizedOriginalName = file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      cb(null, { original_name: sanitizedOriginalName });
    },
    key: function (req, file, cb) {
      const mimetype = file.mimetype.split("/");
      cb(null, "users/" + randomUUID() + "" + Date.now() + "." + mimetype[1]);
    },
  }),
  limits: { fieldSize: 500 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const types = ["image.jpg", "image/jpeg", "image/png"];
    if (!types.includes(file.mimetype)) {
      cb(
        new Error(
          "Seuls les fichiers images au format jpg et png sont autorisés"
        ),
        false
      );
    } else {
      cb(null, true);
    }
  },
});

export const uploadLocalFile = multer({ storage: storage });

// Upload file restaurant on S3
export const uploadFileRestaurant = multer({
  storage: multerS3({
    s3: clientS3,
    bucket: process.env.AWS_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      const sanitizedOriginalName = file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      cb(null, { original_name: sanitizedOriginalName });
    },
    key: function (req, file, cb) {
      cb(
        null,
        "restaurants/" +
          req.params.restaurant +
          "/" +
          randomUUID() +
          "" +
          Date.now()
      );
    },
  }),
  limits: { fieldSize: 500 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const types = [
      "image.jpg",
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/webm",
      "video/3gpp",
      "video/mpeg",
      "video/3gpp2",
    ];
    if (!types.includes(file.mimetype)) {
      cb(
        new Error(
          "Les formats de fichiers autorisés : " +
            "image.jpg, image/jpeg, image/png, video/mp4, video/webm, video/3gpp, video/mpeg, video/3gpp2"
        ),
        false
      );
    } else {
      cb(null, true);
    }
  },
});

export const deleteRestaurantFile = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.restaurant).exec();
    if (!restaurant) {
      res.status(400).json({ message: "Restaurant non trouvé" });
    }
    const file = await FileRestaurant.findById(req.body.file_id).exec();
    const file_key = file.path.replace(process.env.AWS_URL_FILE, "");
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: file_key,
    });
    const response = await clientS3.send(command);
    if (response) {
      await file.deleteOne();
      for (const [index, element] of restaurant.fichiers.entries()) {
        const fichier = await FileRestaurant.findById(element).exec();
        if (!fichier) {
          restaurant.fichiers.splice(index, 1);
        }
      }
      await restaurant.save();
      res.status(200).json({ message: "Fichier supprimé" });
    }
  } catch (err) {
    next(err);
  }
};

export const uploadFileAvis = multer({
  storage: multerS3({
    s3: clientS3,
    bucket: process.env.AWS_BUCKET,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      const sanitizedOriginalName = file.originalname.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      );
      cb(null, { originalname: sanitizedOriginalName });
    },
    key: function (req, file, cb) {
      cb(null, "avis/" + randomUUID() + "" + Date.now());
    },
  }),
  limits: { fieldSize: 500 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const types = [
      "image.jpg",
      "image/jpeg",
      "image/png",
      "video/mp4",
      "video/webm",
      "video/3gpp",
      "video/mpeg",
      "video/3gpp2",
    ];
    if (!types.includes(file.mimetype)) {
      cb(
        new Error(
          "Les formats de fichiers autorisés : " +
            "image.jpg, image/jpeg, image/png, video/mp4, video/webm, video/3gpp, video/mpeg, video/3gpp2"
        ),
        false
      );
    } else {
      cb(null, true);
    }
  },
});
