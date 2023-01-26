import { createRequire } from "module";
import { ChatGPTAPIBrowser } from "chatgpt";
const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer");

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/api", (req, res) => {
    res.json({
        message: "Hello world",
    });
});

app.post("/api/prompt", (req, res) => {
  const { prompt } = req.body;

  //👇🏻 Puppeteer webscraping function
  (async () => {
    let result = await chatgptFunction(prompt);

    //👇🏻 returns the results
        return res.json({
            message: "Request successful!",
            result,
        });
  })();
});

async function chatgptFunction(content) {
  // use puppeteer to bypass cloudflare (headful because of captchas)
  const api = new ChatGPTAPIBrowser({
      email: "wxat333@gmail.com",
      password: "Andkon333!",
      isGoogleLogin: true
  });
  
  await api.initSession();
  const keyValue = await api.sendMessage(content, {
    timeoutMs: 2 * 60 * 1000
  });
  console.log(keyValue.response)

  const businessPlan = await api.sendMessage(`using the following key value pairs generate a unique business plan ${keyValue.response}:`, {
    timeoutMs: 2 * 60 * 1000
  });

  const pitch = await api.sendMessage(`using the following key value pairs generate a unique company pitch ${keyValue.response}:`, {
    timeoutMs: 2 * 60 * 1000
  });

  //👇🏻 Returns the response from ChatGPT
  return {
      businessPlan: businessPlan.response,
      pitch: pitch.response
  };
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});