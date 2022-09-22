import logger from "./utils/logger";
import express from "express";
import cors from "cors";

import crypto from "crypto";

import bodyParser from "body-parser";

import dotenv from "dotenv";
dotenv.config();


const app = express();
// const port = 14000;
const port = process.env.PORT || 14000;

const corsOptions = {
  origin: "*",
  // size limit
  limit: "10mb",
};

app.use(cors(corsOptions));

// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/uploads", express.static("uploads"));

// set limit to 1

app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

import fs from "fs";

app.post("/api/upload", (req, res) => {
  // log form data
  logger.info(req.body.name);
  const fileName = req.body.name;
  const path = crypto.randomBytes(20).toString("hex");

  // block:
  /*
  exe,
  bat,
  sh,
  cmd,
  jar
  */

  const regex = /exe|bat|sh|cmd|jar/gi;

  if (regex.test(fileName.toLowerCase())) {
    res.status(400).send("Invalid file type");
    return;
  }

  // parse the extension out
  const extension = fileName.split(".").pop();

  fs.writeFile(
    `./uploads/${path}.${extension}`,
    req.body.file[0],
    "base64",
    (err) => {
      if (err) {
        logger.error(err);
        res.status(500).json({ message: "Internal server error", error: err });
      } else {
        res.status(200).json({
          message: "File uploaded successfully",
          path: `${path}.${extension}`,
        });
      }
    }
  );
});

app.listen(port, () => {
  logger.info(`Example app listening at http://localhost:${port}`);
});
