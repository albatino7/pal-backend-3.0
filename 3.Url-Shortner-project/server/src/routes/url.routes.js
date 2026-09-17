import express from "express";
import {
  genrateUrlConotroller,
  getAllUrl,
  deleteUrl,
} from "../controller/urlRoouter.controller.js";
const urlRouter = express.Router();

urlRouter.post("/genrate", genrateUrlConotroller);
urlRouter.get("/get-url", getAllUrl);
urlRouter.delete("/delete/:id", deleteUrl);

export default urlRouter;
