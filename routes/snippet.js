const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const encryptor = require("../services/encryptor");
const { Snippet } = require("../models/models");
// Welcome Page
// router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));
router.get("/", ensureAuthenticated, (req, res) => res.render("snippet"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) =>
  res.render("dashboard", {
    user: req.user,
  })
);

router.post("/createsnippets", ensureAuthenticated, async (req, res) => {
  let text = req.body.text;
  let key = req.body.key;
  let finalText = encryptor.encryptor(text, key);
  const { customAlphabet } = require("nanoid");
  const nanoid = customAlphabet(
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLLMNOPQRSTUVWCYZ",
    6
  )();

  const snippet = await Snippet.create({
    snippetBody: finalText,
    key: key,
    shortUrl: nanoid,
    clickCount: 0,
    postedBy: req.user._id,
  });

  res.send({
    snippetBody: finalText,
    key: key,
    shortUrl: nanoid,
    clickCount: 0,
    postedBy: req.user._id,
  });
});

router.get("/:snipptid", ensureAuthenticated, (req, res) => {
  res.render("getsnippets", { params: req.params });
});

router.post("/getsnippet", ensureAuthenticated, async (req, res) => {
  const data = req.body;
  let snippetData = await Snippet.findOne(data);

  if (snippetData) {
    let clickCount = snippetData.clickCount;

    // let finalText = encryptor.encryptor(text, key);
    clickCount++;
    let response = await Snippet.findOneAndUpdate(
      { _id: snippetData._id },
      { clickCount: clickCount },
      { new: true }
    ).populate({
      path: "postedBy",
      select: ["email", "name"],
    });
    response.snippetBody = encryptor.decryptor(
      response.snippetBody,
      response.key
    );
    response.snippetBody = response.snippetBody.trim();
    // res.send(response);
    res.render("snippetsdata", { data: response });
  } else {
    res.send("No data found");
  }

  //   console.log(req.body), res.send("ok");
});
module.exports = router;
