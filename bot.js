import express from "express";
import TelegramBot from "node-telegram-bot-api";
import { getSessionId } from "./getSessionId.js";
import { sendLoginRequest } from "./logincodev2.js";
import { sendResultRequest } from "./results.js";
import { spawn } from "child_process";
import dotenv from "dotenv/config";

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = Number(process.env.ADMIN_CHAT_ID);
const users = [];

// Create a new Telegram bot instance with polling enabled
const bot = new TelegramBot(token, { polling: true });

// Function to run the Python script and capture the output
const runPythonScript = (scriptPath, rollNo) => {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn("python", [scriptPath, rollNo]);

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
  const loadingMessage = await bot.sendMessage(chatId, "Loading...");
  const loadingMessageId = loadingMessage.message_id;
  try {
    // Step 1: Get Session ID
    const sessionId = await getSessionId();

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

    // Step 4: Request Results Data
    await sendResultRequest(rollno, sessionId, antiXsrfToken);

    // Step 5: Run Python Script to Scrape Data
    const studentData = await runPythonScript("scrape.py", rollno);

    // Send the scraped student data to the user
    bot.sendMessage(chatId, studentData);

    // Delete the "Loading..." message
    await bot.deleteMessage(chatId, loadingMessageId);
  } catch (error) {
    await bot.deleteMessage(chatId, loadingMessageId);
    bot.sendMessage(chatId, "I'm unable to fetch your results😥");
    bot.sendMessage(chatId, "/help for details");
  }
};

// Handle `/start` command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Hey TKRian😊! Please enter your roll number for results."
  );
});

// Handle `/support` command
bot.onText(/\/support/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Thank you for supporting!! More features yet to come."
  );
});

// Handle `/help` command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Commands you can use:\n/start - Start the bot\n/support - Show support message\n/help - List all commands"
  );
});

bot.onText(/\/analytics/, (msg) => {
  const chatId = msg.chat.id;
  if (chatId !== adminChatId) {
    bot.sendMessage(chatId, "You are not authorized to view this data.");
    return;
  }
  bot.sendMessage(
    chatId,
    `Analytics:\nTotal users: ${users.length}\nUsers:\n${users
      .map((u) => `${u.rollNo} | ${u.date}`)
      .join("\n")}`
  );
});

// Handle user messages (roll number input)
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.trim();

  // If the message starts with `/`, it's a command, so do nothing further
  if (message.startsWith("/")) {
    return;
  }

  // Treat the message as a roll number
  const rollno = message.toUpperCase();

  // Check if roll number is valid (10 characters long)
  if (rollno.length !== 10) {
    bot.sendMessage(chatId, "Please enter a valid roll number.");
    return;
  }
  const myUser = {
    rollNo: rollno,
    chatId: chatId,
    date: new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    }).format(new Date()),
  };
  const thisUser = users.find((r) => r.rollNo === rollno);
  if (!thisUser) {
    users.push(myUser);
  } else {
    thisUser.date = myUser.date;
  }
  processStudentData(chatId, rollno);
});

// Add Express server
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Telegram bot is running!");
});

// Start Express server
app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
