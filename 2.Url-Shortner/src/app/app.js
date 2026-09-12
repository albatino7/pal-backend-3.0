import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import urlRouter from "../routes/url.routes.js";
import urlModel from "../model/url.model.js";

app.use("/api/url", urlRouter);

app.post("/:code", async (req, res) => {
  const { code } = req.params;
  //   console.log("hello");

  const sendUrl = await urlModel.findOne({
    shortCode: code,
  });

  res.redirect(sendUrl.orignalUrl);

  await urlModel.findOneAndUpdate(
    {
      shortCode: code,
    },
    {
      $inc: { clicks: 1 },
    },
  );
});

export default app;
