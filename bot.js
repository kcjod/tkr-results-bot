import TelegramBot from "node-telegram-bot-api";
import { sendLoginRequest } from "./logincode.js";
import { sendResultRequest } from "./results.js";
import { spawn } from "child_process";
import dotenv from "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;

// Create a new Telegram bot instance with polling enabled
const bot = new TelegramBot(token, { polling: true });

// Function to run the Python script and capture the output
const runPythonScript = (scriptPath) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [scriptPath]);

    let outputData = "";

    pythonProcess.stdout.on("data", (data) => {
      outputData += data.toString();
    });

    // Capture stderr (errors from the Python script)
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Error: ${data.toString()}`);
      reject(`Error: ${data.toString()}`);
    });

    // Handle process exit
    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(outputData);
      } else {
        reject(`Python script exited with code ${code}`);
      }
    });
  });
};

const processStudentData = async (chatId, rollno) => {
  try {
    const loginStatus = await sendLoginRequest(rollno);

    if (loginStatus === 200) {
      bot.sendMessage(
        chatId,
        `If the entered roll number is not found, then I'll show the previous data.`
      );
      await sendResultRequest();

      const studentData = await runPythonScript("scrape.py");

      // Send the scraped student data to the user
      bot.sendMessage(chatId, studentData);
    } else {
      bot.sendMessage(chatId, "Something went wrong. Please try again.");
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "An error occurred while processing the data.");
  }
};

// Handle `/start` command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Welcome! Please enter your roll number.");
});

// Handle user messages (roll number input)
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.toUpperCase();
  const userMessage = message;

  // If the message is not a command, treat it as a roll number
  if (!userMessage.startsWith("/")) {
    const rollno = userMessage.trim();

    // Check if roll number is valid (10 characters long)
    if (rollno.length !== 10) {
      bot.sendMessage(chatId, "Please enter a valid roll number");
      return;
    }

    if (rollno) {
      processStudentData(chatId, rollno);
    } else {
      bot.sendMessage(chatId, "Please enter a valid roll number.");
    }
  }
});
