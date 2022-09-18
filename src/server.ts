import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
const cohere = require("cohere-ai");

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const cohereKey = process.env.COHERE_API;
const assemblyKey = process.env.ASSEMBLY_API;
const axios = require("axios");
const fs = require("fs");

app.use(express.json());
app.use(express.static("src"));

app.get("/", (req: Request, res: Response) => {
  res.sendFile("index.html", { root: __dirname });
});

app.post("/albert", async (req: Request, res: Response) => {
  console.log("albert called");
  let msgs = req.body.text;
  let chatPrompt =
    "An understanding therapy bot named Albert in a supporting conversation with a Human\n" +
    msgs +
    "Albert: ";

  console.log("---", chatPrompt, "---");
  // let albert = false;
  // for (let i = 0; i < msgs.length; i++) {
  //   if (albert) {
  //     chatPrompt += "Albert: ";
  //   } else {
  //     chatPrompt += "Human: ";
  //   }
  //   chatPrompt += msgs[i];
  //   chatPrompt += "\n";
  // }

  cohere.init(cohereKey);
  //@ts-ignore
  const response = await cohere.generate({
    prompt: chatPrompt,
    stop_sequences: ["\n"],
  });
  console.log(`Prediction: ${response.body.generations[0].text}`);
  res.json({ text: response.body.generations[0].text });
});

app.post("/transcribe", async (req: Request, res: Response) => {
  console.log("got transcribe");
  const data = req.body.audio.split(",");
  data.shift();
  fs.writeFileSync("temp.webm", new Buffer(data.join(","), "base64"));
  const assemblyUpload = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: assemblyKey,
      "content-type": "application/json",
      "transfer-encoding": "chunked",
    },
  });
  const file = "./temp.webm";
  let fileLink = "";
  const fileData = await fs.readFileSync(file);
  let uploadResponse = await assemblyUpload.post("/upload", fileData);
  // console.log(uploadResponse);
  fileLink = uploadResponse.data.upload_url;
  // console.log(fileLink);

  const assembly = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
      authorization: assemblyKey,
      "content-type": "application/json",
    },
  });
  await assembly.post("/transcript", {
    audio_url: fileLink,
  });

  await new Promise((resolve) => setTimeout(resolve, 15000)); // 3 sec

  const response = await assembly.get("/transcript", {
    audio_url: fileLink,
  });

  let i = response.data.transcripts.length - 1;
  let transcript = response.data.transcripts[0];

  // console.log(response.data.transcripts);
  // while (transcript.status !== "completed") {
  //   console.log(transcript);
  //   i -= 1;
  //   transcript = response.data.transcripts[i];
  // }
  // console.log(transcript);

  const words = await assembly.get(transcript.resource_url);
  const text = words.data.text;
  res.send(JSON.stringify({ text: text }));

  // const albertResponse = text.split("Albert:");
  // console.log(text);
  // console.log(albertResponse[albertResponse.length - 1]);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
