const routes = require("express").Router();
const multer = require("multer");
const multerConfig = require("../config/multer");
const Post = require("../models/post");

routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
  const { originalName: name, key, location: url = "" } = req.file;

  const { valor } = req.body;
  const vetor = await Post.create({
    name,
    key,
    value: valor,
    url,
  });

  return res.json(vetor);
});

routes.get("/posts", async (req, res) => {
  const posts = await Post.find();

  return res.json(posts);
});

routes.delete("/posts/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  await post.remove();

  return res.send();
});

module.exports = routes;
