const mongoose = require("mongoose");
const aws = require("aws-sdk");
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  name: String,
  key: String,
  value: [],
  url: String,
});

PostSchema.pre("save", async function () {
  if (!this.url) {
    const url = this.key.replace(/ /g, "%20");
    this.url = `${process.env.APP_URL}/files/${url}`;
  }
});

PostSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE === "s3") {
    return s3
      .deleteObject({
        Bucket: "upload-ic",
        Key: this.key,
      })
      .promise();
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

module.exports = mongoose.model("Post", PostSchema);
