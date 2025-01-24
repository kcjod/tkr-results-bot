import TelegramBot from "node-telegram-bot-api";
import { getSessionId } from "./getSessionId.js";
import { sendLoginRequest } from "./logincodev2.js";
import { sendResultRequest } from "./results.js";
import { spawn } from "child_process";
import dotenv from "dotenv/config";
import { createPaymentLink, getPaymentStatus } from "./pay.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = Number(process.env.ADMIN_CHAT_ID);

const users = [];

// Create a new Telegram bot instance with polling enabledF
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
  bot.sendMessage(chatId, "Mail me at kcisthe@gmail.com for any queries");
});

// bot.onText(/\/donate/, async (msg) => {
//   const chatId = msg.chat.id;
//   const thisUser = users.find((r) => r.chatId === chatId);
//   try {
//     const { id, short_url } = await createPaymentLink(chatId);
//     thisUser.paymentId = id;
//     // console.log(thisUser.paymentId)

//     bot.sendMessage(
//       chatId,
//       `Click here to pay: ${short_url}\nAfter payment open the bot and hit /status for your payment status.\nThanks for donating.`
//     );
//   } catch (error) {
//     bot.sendMessage(chatId, `Error: ${error.message}`);
//   }
// });

// bot.onText(/\/status/, async (msg) => {
//   const chatId = msg.chat.id;
//   const thisUser = users.find((r) => r.chatId === chatId);
//   console.log(thisUser);
//   try {
//     const status = await getPaymentStatus(thisUser.paymentId);

//     bot.sendMessage(chatId, `Last payment status: ${status}`);
//   } catch (error) {
//     bot.sendMessage(chatId, `Error: ${error.message}`);
//   }
// });

// bot.onText(/\/me/, (msg) => {
//   const chatId = msg.chat.id;
//   const thisUser = users.find((r) => r.chatId === chatId);
//   console.log(thisUser)
//   bot.sendMessage(
//     chatId,
//     `Your details:\nRoll Number: ${thisUser.rollNo}\nLast used: ${
//       thisUser.date
//     }\nPayments: ${
//       thisUser.payments.length === 0
//         ? "No payments to show"
//         : thisUser.payments.forEach((payment) => {
//             return `${payment.id}: ${payment.status}`;
//           })
//     }`
//   );
// });


bot.onText(/\/donate/, async (msg) => {
    const chatId = msg.chat.id;
      bot.sendMessage(
        chatId,
        `Click here to pay: https://razorpay.me/@krishnachaitanyakattoju\nThanks for helping the service.`
      );
  });

// Handle `/help` command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Commands you can use:\n/start - Start the bot\n/support - For your queries\n/donate - For donating to the service\n/help - List all commands"
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
      .map((u) => `${u.rollNo ?? u.chatId} | ${u.date}`)
      .join("\n")}`
  );
});

// Handle user messages (roll number input)
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.trim();

  const thisUser = users.find((r) => r.chatId === chatId);

  if (!thisUser) {
    const myUser = {
      rollNo: null,
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
      paymentId: null,
    };
    users.push(myUser);
  }

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

  thisUser.rollNo = rollno;
  (thisUser.date = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(new Date())),
    processStudentData(chatId, rollno);
});
