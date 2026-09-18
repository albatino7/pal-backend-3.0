import app from "../src/app/app.js";
import { ConnectToDB } from "../src/db/db.js";
import { config } from "../src/config/config.js";

ConnectToDB();

app.listen(config.PORT, () => {
  console.log("Server is Runing on Port 3000");
});
