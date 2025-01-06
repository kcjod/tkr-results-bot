import axios from "axios";
import qs from "qs";
// import fs from "fs";
// import { getSessionId } from "./getSessionId.js";
// import { sendResultRequest } from "./results.js";

export const sendLoginRequest = async (rollno, sessionId) => {
  let data = qs.stringify({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE:
      "/wEPDwUKLTMwMTg5NjI5NA9kFgICAw9kFgYCBQ8PFgIeB1Zpc2libGVoZGQCCw8PFgIeBFRleHRkZGQCDQ8PFgIfAGdkFgQCAQ8PFgofAQUNU3R1ZGVudCBMb2dpbh4JRm9yZUNvbG9yCiMeCUZvbnRfQm9sZGceCUZvbnRfU2l6ZSgqIlN5c3RlbS5XZWIuVUkuV2ViQ29udHJvbHMuRm9udFVuaXQEMThwdB4EXyFTQgKEGGRkAhEPDxYCHwFkZGRkGNxfPUQ/4awYvpMSYEkIKIq4ReE1tk2MvpRoxiYYEwg=",
    __VIEWSTATEGENERATOR: "C2EE9ABB",
    __EVENTVALIDATION:
      "/wEdAAkLs/+LkJMTfd/QR/vwCXfiELYayygIrYKbL/Dx4x5DdMr/oJFE+eOmI+wQrfEPHbtpOCqQ5ELEfO+O75msrGKkDlm4ViRSj8IOmM+vzfHmfTPSlu16Yx4QbiDU+dddK1OinihG6d/Xh3PZm3b5AoMQ+Ot37oCEEXP3EjBFcbJhKCh34ya5objibTUZ9mTnN+SHux3UAhIbdDF6W45n+rJhxchFn1A7CVu6MJ4SwD/zmw==",
    txtUserId: `${rollno}`,
    txtPwd: `${rollno}`,
    btnLogin: "Login",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.tkrcetautonomous.org/",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.6",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      cookie: `${sessionId}`,
      origin: "https://www.tkrcetautonomous.org",
      priority: "u=0, i",
      referer: "https://www.tkrcetautonomous.org/",
      "sec-ch-ua": '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    // console.log(config.headers.cookie);
    // console.log(`Login successful for ${rollno}`);
    return response;
  } catch (error) {
    console.error("Error occurred:", error.message);
    throw error;
  }
};

// (async () => {
//   try {
//     // Step 1: Get Session ID
//     const sessionId = await getSessionId();
//     console.log(sessionId);

//     // Step 2: Perform Login Request
//     const rollno = "22K91A05B8";
//     const loginData = await sendLoginRequest(rollno, sessionId);

//     // Step 3: Extract Cookies from Response Headers
//     const setCookieHeader = loginData.headers?.["set-cookie"] || [];
//     let antiXsrfToken = "";

//     // Parse the cookies to extract `__AntiXsrfToken`
//     setCookieHeader.forEach((cookie) => {
//       if (cookie.startsWith("__AntiXsrfToken=")) {
//         antiXsrfToken = cookie.split(";")[0].split("=")[1]; // Extract the value of `__AntiXsrfToken`
//       }
//     });

//     if (!antiXsrfToken) {
//       throw new Error("AntiXsrfToken not found in response cookies.");
//     }

//     console.log(sessionId);
//     console.log(antiXsrfToken);

//     // Step 4: Request Results Data
//     await sendResultRequest(sessionId, antiXsrfToken);
//   } catch (error) {
//     console.error("An error occurred:", error.message);
//   }
// })();
