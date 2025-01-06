import TelegramBot from "node-telegram-bot-api";
import { getSessionId } from "./getSessionId.js";
import { sendLoginRequest } from "./logincodev2.js";
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
    // Step 1: Get Session ID
    const sessionId = await getSessionId();
    // console.log("Session ID:", sessionId);

    // Step 2: Perform Login Request
    const loginData = await sendLoginRequest(rollno, sessionId);

    // Step 3: Extract Cookies from Response Headers
    const setCookieHeader = loginData.headers?.["set-cookie"] || [];
    let antiXsrfToken = "";

    // Parse the cookies to extract `__AntiXsrfToken`
    setCookieHeader.forEach((cookie) => {
      if (cookie.startsWith("__AntiXsrfToken=")) {
        antiXsrfToken = cookie.split(";")[0].split("=")[1];
      }
    });

    if (!antiXsrfToken) {
      throw new Error("AntiXsrfToken not found in response cookies.");
    }

    // console.log("AntiXsrfToken:", antiXsrfToken);

    // Step 4: Request Results Data
    await sendResultRequest(sessionId, antiXsrfToken);

    // Step 5: Run Python Script to Scrape Data
    const studentData = await runPythonScript("scrape.py");

    // Send the scraped student data to the user
    bot.sendMessage(chatId, studentData);
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "An error occurred while processing the data. Please try again.");
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
      bot.sendMessage(chatId, "Please enter a valid roll number.");
      return;
    }

    if (rollno) {
      processStudentData(chatId, rollno);
    } else {
      bot.sendMessage(chatId, "Please enter a valid roll number.");
    }
  }
});
