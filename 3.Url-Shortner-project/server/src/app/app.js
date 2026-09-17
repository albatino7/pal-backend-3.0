import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import urlRouter from "../routes/url.routes.js";
import urlModel from "../model/url.model.js";

app.use("/api/url", urlRouter);

app.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;

    const sendUrl = await urlModel.findOne({
      shortCode: code,
    });

    // Short code does not exist
    if (!sendUrl) {
      return res.status(404).json({
        message: "Your Shortcode is Not Found in Db",
      });
    }

    // Increase click count
    await urlModel.findOneAndUpdate(
      {
        shortCode: code,
      },
      {
        $inc: { clicks: 1 },
      },
    );

    // Redirect to original URL
    return res.redirect(sendUrl.orignalUrl);
  } catch (error) {
    next(error);
  }
});
export default app;
