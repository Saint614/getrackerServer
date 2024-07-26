const express = require("express");
const Item = require("../models/item");
const authenticate = require("../authenticate");

const itemRouter = express.Router();

itemRouter
  .route("/")
  .get((req, res, next) => {
    Item.find()
      .then((items) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(items);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    Item.create(req.body)
      .then((item) => {
        console.log("Item Created ", item);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(item);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /items");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Item.deleteMany()
      .then((response) => {
        res.statusCOde = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

itemRouter
  .route("/:itemId")
  .get((req, res, next) => {
    Item.findById(req.params.itemId)
      .then((item) => {
        res.statusCOde = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(item);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /items/${req.params.itemId}`);
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Item.findByIdAndUpdate(
      req.params.itemId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((item) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(item);
      })
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Item.findByIdAndDelete(req.params.itemId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = itemRouter;
