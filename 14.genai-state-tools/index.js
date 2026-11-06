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

const message = [];

while (true) {
  const userInput = await readline.question("Enter Your Question");

  message.push({
    role: "user",
    content: userInput,
  });

  const stream = await model.stream(message);

  let aiResponse = "";
  for await (const chunks of stream) {
    process.stdout.write(chunks.text);
    aiResponse += chunks.text;
  }

  message.push({
    role: "assistant",
    content: aiResponse,
  });

  process.stdout.write("\n");

  //   console.log(res.content);
}
