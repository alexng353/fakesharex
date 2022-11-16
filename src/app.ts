import logger from "./utils/logger";
import express from "express";
import cors from "cors";

import crypto from "crypto";

import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();

const ObjectId = require("mongodb").ObjectId;

import { Collection, MongoClient } from "mongodb";

const url: string | undefined = process.env.DATABASE_URL;
const client = new MongoClient(url!);
interface uploads {
  name: string;
  slug: string;
  classId?: string;
  userId?: string;
  timestamp: Date;
}

const database = client.db();
const uploads: Collection<uploads> = database.collection("uploads");

const app = express();
// const port = 14000;
const port = process.env.PORT || 14000;

const corsOptions = {
  origin: "*",
  // size limit
  limit: "100mb",
};

app.use(cors(corsOptions));

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "100000kb" }));

app.use("/uploads", express.static("uploads"));

// set limit to 1

app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(403).json({ message: "forbidden" });
});

app.get("/test", (req, res) => {
  console.log("test");

  res.status(200).json({ message: "success" });
});

import fs from "fs";

app.post("/api/v2/upload", async (req, res) => {
  const { name, files, userId, classId } = req.body;

  interface Return {
    path: string;
  }
  const returns: Return[] = [];

  interface FakeFile {
    name: string;
    size: number;
    type: string;
    file: string;
  }
  const promises = files.map(async (file: FakeFile) => {
    const { name, size, type, file: fileData } = file;
    const fileBuffer = Buffer.from(fileData, "base64");
    const fileHash = crypto.randomBytes(20).toString("hex");
    const fileName = `${fileHash}.${name.split(".").pop()}`;
    const filePath = `uploads/${fileName}`;

    fs.writeFileSync(filePath, fileBuffer);

    const user = await database

      .collection("AccountData")

      .findOne({ googleId: userId });

    await uploads.insertOne({
      name,
      slug: fileName,
      userId: new ObjectId(user?._id),
      timestamp: new Date(),
      classId: classId && new ObjectId(classId),
    });

    // console.log(upload);

    returns.push({
      path: fileName,
    });
  });

  await Promise.all(promises);

  return res.status(200).json({ message: "success", data: returns });
});

app.listen(port, () => {
  logger.info(`Uploader listening at http://localhost:${port}`);
});
