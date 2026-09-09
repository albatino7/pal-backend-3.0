import app from "./src/app/app.js";
import config from "./src/config/config.js";
import connectToDB from "./src/db/connectToDB.js";

connectToDB();

app.listen(config.PORT, () => {
  console.log("Your Server  is Running On port ", config.PORT);
});
