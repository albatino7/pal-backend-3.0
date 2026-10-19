import app from "./app/app.js";
import config from "./config/config.js";
import { connectToDb } from "./db/connectToDb.js";

await connectToDb();

app.listen(config.PORT, () => {
  console.log("connected TO PORT 3000 ");
});
