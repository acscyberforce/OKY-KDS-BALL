const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "info",
    version: "1.0",
    author: "IMON",
    role: 0,
    shortDescription: "Owner Info",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {

      // IMAGE URL
      const imgUrl = "https://i.imgur.com/bTXGyD2.jpeg";

      // CACHE FOLDER
      const cacheDir = path.join(__dirname, "cache");

      // CREATE CACHE FOLDER IF NOT EXISTS
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }

      // IMAGE PATH
      const imgPath = path.join(cacheDir, "info.jpg");

      // DOWNLOAD IMAGE
      const response = await axios({
        url: imgUrl,
        method: "GET",
        responseType: "stream"
      });

      // SAVE IMAGE
      const writer = fs.createWriteStream(imgPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {

        // MESSAGE
        const msg = `
╔════════════════════╗
      ☠ OWNER INFO ☠
╚════════════════════╝

👤 NAME    : IMON KHAN
🏷 NICK    : TIGER IMON ⚡
⚧ GENDER  : MALE
🌍 COUNTRY : BANGLADESH 🇧🇩
🟢 STATUS  : ONLINE

╭━━━[ SKILLS ]━━━╮
➤ HTML
➤ CSS
➤ JAVASCRIPT
➤ NODE JS
➤ BOT EDIT
➤ GRAPHIC DESIGN
╰━━━━━━━━━━━━━━━╯

⚡ POWER : ROOT ACCESS
🚀 BOT OWNER : IMON KHAN
`;

        // SEND MESSAGE WITH IMAGE
        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(imgPath)
          },
          event.threadID,
          () => fs.unlinkSync(imgPath),
          event.messageID
        );

      });

      writer.on("error", (err) => {
        console.log(err);
        api.sendMessage("❌ IMAGE SAVE ERROR", event.threadID);
      });

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ ERROR OCCURRED", event.threadID);
    }
  }
};
