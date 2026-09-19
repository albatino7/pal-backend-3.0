import app from "../src/app/app.js";
import { config } from "./config/config.js";
import { connectToDB } from "./db/db.js";

await connectToDB();

app.listen(config.PORT, () => {
  console.log("Server is Running On Port", config.PORT);
});
