import app from "./app/app.js";
import connectToDB from "./db/db.js";
import config from "./config/config.js";
connectToDB();

app.listen(config.PORT, () => {
  console.log("Sever is Running on Port", config.PORT);
});
