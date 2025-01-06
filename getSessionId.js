import axios from "axios";
import qs from "qs"

export const getSessionId = async () => {
  let data = qs.stringify({
    '__EVENTTARGET': 'lnkStudent',
    '__EVENTARGUMENT': '',
    '__VIEWSTATE': '/wEPDwUKLTMwMTg5NjI5NA9kFgICAw9kFgICBQ8PFgIeB1Zpc2libGVoZGRkUAJArViDKn5tO4whM+I36sJK/Jd5ms15uPUZfAOjYn0=',
    '__VIEWSTATEGENERATOR': 'C2EE9ABB',
    '__EVENTVALIDATION': '/wEdAAQsLRfRPFnuoXDt9mu7tWI3ELYayygIrYKbL/Dx4x5DdMr/oJFE+eOmI+wQrfEPHbtpOCqQ5ELEfO+O75msrGKkcSGcXyiIzOERTrSKn1BbI80xMM5J05k45L0Ebsutbok=' 
  });
  
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://www.tkrcetautonomous.org/',
    headers: { 
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
      'accept-language': 'en-US,en;q=0.6', 
      'cache-control': 'max-age=0', 
      'content-type': 'application/x-www-form-urlencoded', 
      'origin': 'https://www.tkrcetautonomous.org', 
      'priority': 'u=0, i', 
      'referer': 'https://www.tkrcetautonomous.org/', 
      'sec-ch-ua': '"Brave";v="131", "Chromium";v="131", "Not_A Brand";v="24"', 
      'sec-ch-ua-mobile': '?1', 
      'sec-ch-ua-platform': '"Android"', 
      'sec-fetch-dest': 'document', 
      'sec-fetch-mode': 'navigate', 
      'sec-fetch-site': 'same-origin', 
      'sec-fetch-user': '?1', 
      'sec-gpc': '1', 
      'upgrade-insecure-requests': '1', 
      'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36',
    },
    data : data
  };

  try {
    const response = await axios.request(config);

    // Extract 'set-cookie' header
    const setCookieHeader = response.headers["set-cookie"];

    if (setCookieHeader && Array.isArray(setCookieHeader)) {
      // Find the 'ASP.NET_SessionId' cookie
      const sessionIdCookie = setCookieHeader.find((cookie) =>
        cookie.startsWith("ASP.NET_SessionId=")
      );

      // Extract the actual session ID value
      const sessionId = sessionIdCookie
        ? sessionIdCookie.split(";")[0] // Split at ';' to remove extra info
        : "No Session ID found.";

      return sessionId
    } else {
      console.log("No 'set-cookie' header found.");
    }
  } catch (error) {
    console.error("Error occurred:", error.message);
  }
};
