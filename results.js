import axios from "axios";
import fs from "fs";

export const sendResultRequest = async (sessionId, antiXsrfToken) => {
  // Construct the cookie dynamically
  const cookieHeader = `${sessionId};__AntiXsrfToken=${antiXsrfToken}`;
  console.log(cookieHeader)

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://www.tkrcetautonomous.org/StudentLogin/Student/OverallMarksSemwise.aspx",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.6",
      "cache-control": "max-age=0",
      cookie: cookieHeader,
      priority: "u=0, i",
      referer:
        "https://www.tkrcetautonomous.org/StudentLogin/Student/OverallMarksSemwise.aspx",
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
  };

  try {
    const response = await axios.request(config);
    fs.writeFileSync("data.html", response.data, "utf-8");
    console.log("Data successfully written to data.html");
  } catch (error) {
    console.error("Error occurred", error.message);
  }
};
