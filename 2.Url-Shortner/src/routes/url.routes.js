import express from "express";
import {
  genrateUrlConotroller,
  getAllUrl,
} from "../controller/urlRoouter.controller.js";
const urlRouter = express.Router();

urlRouter.post("/genrate", genrateUrlConotroller);
urlRouter.get("/get-url", getAllUrl);

export default urlRouter;
