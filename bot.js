require("dotenv").config();
const express = require("express");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pfpFolderPath = path.join(__dirname, "pfp");
if (!fs.existsSync(pfpFolderPath)) {
  fs.mkdirSync(pfpFolderPath);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pfpFolderPath);
  },
  filename: (req, file, cb) => {
    const newFileName = req.body.message3 || file.originalname;
    const fileExtension = "";
    cb(null, `${newFileName}${fileExtension}`);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/messages", async (req, res) => {
  try {
    const response = await axios.get(
      `https://discord.com/api/v10/channels/${process.env.CHANNEL_ID}/messages?limit=9`,
      {
        headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
      }
    );

    // Process messages to include all attachment URLs
    const messagesWithAttachments = response.data.map((msg) => ({
      id: msg.id,
      author: msg.author,
      content: msg.content,
      timestamp: msg.timestamp,
      attachments: msg.attachments || [], // Include all attachments
    }));

    res.json(messagesWithAttachments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages", details: error.message });
  }
});


app.get("/files", async (req, res) => {
  try {
    const files = await fs.promises.readdir(pfpFolderPath);
    const fileNames = files.filter((file) =>
      fs.lstatSync(path.join(pfpFolderPath, file)).isFile()
    );
    res.json(fileNames);
  } catch (error) {
    res.status(500).json({ error: "Failed to read 'pfp' folder", details: error.message });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({ success: true, message: "File uploaded successfully" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
