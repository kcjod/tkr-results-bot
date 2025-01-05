import axios from "axios";
import qs from "qs";
import fs from "fs";

export const sendLoginRequest = async (rollno) => {
  let data = qs.stringify({
    __EVENTTARGET: "",
    __EVENTARGUMENT: "",
    __VIEWSTATE:
      "/wEPDwUKLTMwMTg5NjI5NA9kFgICAw9kFgYCBQ8PFgIeB1Zpc2libGVoZGQCCw8PFgIeBFRleHRkZGQCDQ8PFgIfAGdkFgQCAQ8PFgofAQUNU3R1ZGVudCBMb2dpbh4JRm9yZUNvbG9yCiMeCUZvbnRfQm9sZGceCUZvbnRfU2l6ZSgqIlN5c3RlbS5XZWIuVUkuV2ViQ29udHJvbHMuRm9udFVuaXQEMThwdB4EXyFTQgKEGGRkAhEPDxYCHwFkZGRkGNxfPUQ/4awYvpMSYEkIKIq4ReE1tk2MvpRoxiYYEwg=",
    __VIEWSTATEGENERATOR: "C2EE9ABB",
    __EVENTVALIDATION:
      "/wEdAAkLs/+LkJMTfd/QR/vwCXfiELYayygIrYKbL/Dx4x5DdMr/oJFE+eOmI+wQrfEPHbtpOCqQ5ELEfO+O75msrGKkDlm4ViRSj8IOmM+vzfHmfTPSlu16Yx4QbiDU+dddK1OinihG6d/Xh3PZm3b5AoMQ+Ot37oCEEXP3EjBFcbJhKCh34ya5objibTUZ9mTnN+SHux3UAhIbdDF6W45n+rJhxchFn1A7CVu6MJ4SwD/zmw==",
    txtUserId: rollno,
    txtPwd: rollno,
    btnLogin: "Login",
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "https://www.tkrcetautonomous.org/",
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "content-type": "application/x-www-form-urlencoded",
      cookie:
        "ASP.NET_SessionId=n24bltrioegclfrezuabccui; __AntiXsrfToken=b8297ef8093942e7958894d9a6407f69; .ASPXAUTH=75CC702D1A6F763F131D36B29A208EEE6A1BA4EFD3FBB43FA7FD0DDA1562C57AAB4D2F40989F89E1D46E1052D519BE4408E180318DEB3AD4D71CBCF36A0FC58E9027A42DA8552D0E6CF32D417EBC95D1D7EC3A5347FB084B4C3A17A57FA00C2FD6B31E8623DC9194C125DC17D13A09AC4D15CAD21FA0BB2791822C457C0793DDBFFAA4F31337DD56250DDD13D93EBCFFD0EA6C39925DC9F04664E4F33482017C935684C5D6184E60E793515F56F6504F238F2A5D2B35DF0C8BD22ACB8FAB5B61",
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
    console.log(`Login successful for ${rollno}`);
    return response.status;
  } catch (error) {
    console.error("Error occurred");
  }
};