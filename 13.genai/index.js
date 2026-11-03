import dotenv from "dotenv";

dotenv.config();

import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

while (true) {
  const userInput = await readline.question("Enter Your Question :  ");

  const stream = await model.stream([
    {
      role: "user",
      content: userInput,
    },
  ]);

  for await (const chunk of stream) {
    process.stdout.write(chunk.text);
  }

  process.stdout.write("\n");

  //   const resposne = await model.stream(userInput);

  //   console.log("AI : ", resposne.content);
}
//   readline.close();

// console.log(resposne.content);
