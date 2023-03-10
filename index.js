import { createRequire } from "module";
import { ChatGPTAPIBrowser } from "chatgpt";
const require = createRequire(import.meta.url);
const puppeteer = require("puppeteer");
const dotenv = require("dotenv")
const compression = require("compression");
const helment = require("helmet");
const express = require("express");

dotenv.config()
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(compression());
app.use(helment());
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
      email: process.env.OPENAI_EMAIL,
      password: process.env.OPENAI_PASSWORD,
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
  //api.closeSession();
  //👇🏻 Returns the response from ChatGPT
  return {
      businessPlan: businessPlan.response,
      pitch: pitch.response
  };
}

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});