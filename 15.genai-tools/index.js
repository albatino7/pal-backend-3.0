import dotenv from "dotenv";
dotenv.config();

import { ChatGroq } from "@langchain/groq";
import rl from "readline/promises";
import * as z from "zod";
import { createAgent, tool } from "langchain";

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const addevent = [];

const addeventtool = tool(
  ({ date, title, description }) => {
    console.log("Adding event...");

    addevent.push({
      date,
      title,
      description,
    });

    return "Event added successfully";
  },
  {
    name: "add_event",
    description: "Add a new event to the event list",
    schema: z.object({
      date: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  },
);

const readEvent = tool(
  () => {
    console.log("Reading all events...");
    return JSON.stringify(addevent);
  },
  {
    name: "read_events",
    description: "Retrieve all previously saved events",
    schema: z.object({}),
  },
);

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  apiKey: process.env.GROQ_API_KEY,
});

const agent = createAgent({
  model,
  tools: [addeventtool, readEvent],
  systemPrompt: `
    You are an event management assistant.

    Use add_event when the user wants to create an event.
    Use read_events when the user asks to see saved events.
    Never claim an event was saved unless the tool succeeds.
  `,
});

let messages = [];

while (true) {
  const userInput = await readline.question("Enter Your Question: ");

  if (userInput.toLowerCase() === "exit") break;

  try {
    const result = await agent.invoke({
      messages: [
        ...messages,
        {
          role: "user",
          content: userInput,
        },
      ],
    });

    // Preserve complete agent history
    messages = result.messages;

    console.log("\nAI:", result.messages.at(-1).content);
    console.log();
  } catch (error) {
    console.log("Error:", error.message);
  }
}

readline.close();
