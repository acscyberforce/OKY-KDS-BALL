const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "info",
    author: "IMON",
    role: 0,
    shortDescription: "Owner Info",
    category: "admin"
  },

  onStart: async function ({ api, event }) {
    try {

      // 🖼️ IMAGE LINK
      const imgUrl = ""https://i.imgur.com/bTXGyD2.jpeg",";

      // 📂 SAVE PATH
      const imgPath = __dirname + "/cache/info.jpg";

      // ⬇️ DOWNLOAD IMAGE
      const response = await axios({
        url: imgUrl,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(imgPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {

        // 👑 INFO TEXT
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

        // 📤 SEND IMAGE + TEXT
        await api.sendMessage({
          body: msg,
          attachment: fs.createReadStream(imgPath)
        }, event.threadID);

        fs.unlinkSync(imgPath);
      });

    } catch (e) {
      console.log(e);
      api.sendMessage("❌ ERROR", event.threadID);
    }
  }
};
