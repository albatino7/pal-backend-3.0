import app from "./app/app.js";
import { connectToDB } from "./db/db.js";
connectToDB();
app.listen(3000, () => {
  console.log("Server is Running On Port 3000");
});
