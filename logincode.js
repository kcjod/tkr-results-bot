import axios from "axios";
import qs from "qs";
import fs from "fs";

export const sendLoginRequest = async(rollno) => {
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
        "ASP.NET_SessionId=4ot4vypjlefhlq4z3s5xnspl; .ASPXAUTH=D8AAD16B9F867999B8D5FDB1D29A259544DC395D65CA67E8546A2AE1CDD1B79B8804E548FE42D80FCF9047DA69AF9D95E35530E410E5F945B6CC70CC4B56723B68F7FE5B9EB96986570DA13C59D6C7FC77163C6F1B0B0407781CB59928751FFE61E80DE7C0CD72039ED51681D1B2F3776E4E7D9DDA9070B893C2EE96FD8EFF50B3B98E018C7FB30F134AC27895A26993811164429B99875B5160B40F9374070EC02562CCEBB70A2F0ACE2A4544ED60C054BE0722C6CDFC99662F8B6062A66539; __AntiXsrfToken=a1b2f2f8a7ac4356980ed769415365eb",
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
}