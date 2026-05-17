const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.0",
    author: "IMON",
    role: 0,
    shortDescription: "Owner Information",
    longDescription: "Show owner info with video",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {

      // OWNER INFO
      const ownerInfo = {
        name: "𓆩⟡ 👾𝐈𝐌𝐎𝐍 𝐊𝐇𝐀𝐍 ⟡𓆪⚠️",
        gender: "𝐌𝐀𝐋𝐄 👾🌪️",
        nick: "𝗟𝗘͜͡𝗔𝗗𝗘𝗥 𝗩𝗔͜͡𝗜 ⚠️🏴‍☠"
      };

      // VIDEO URL
      const videoUrl = "https://i.imgur.com/VEenIve.mp4";

      // TMP FOLDER PATH
      const tmpFolder = path.join(__dirname, "tmp");

      // CREATE TMP FOLDER
      if (!fs.existsSync(tmpFolder)) {
        fs.mkdirSync(tmpFolder, { recursive: true });
      }

      // VIDEO SAVE PATH
      const videoPath = path.join(tmpFolder, "owner_video.mp4");

      // DOWNLOAD VIDEO
      const response = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "stream"
      });

      // SAVE VIDEO
      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      writer.on("finish", async () => {

        // MESSAGE
        const msg = `
╭────────────◊
├─⦿ 𝐁𝐨𝐭 & 𝐎𝐰𝐧𝐞𝐫 𝐈𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧
├─⦿ 𝐍𝐚𝐦𝐞: ${ownerInfo.name}
├─⦿ 𝗩𝗶͜͡𝗿𝘂𝘀 𝗔𝗹𝗲𝗿𝘁 ⚡📨
├─⦿ 𝗢𝗽𝗽͜͡𝘀𝘀𝘀 ....... 🎭
├─⦿ 𝗙𝗮𝘃𝗼𝗿𝗶𝘁𝗲 𝘄𝗼𝗿𝗱 : 𝗘𝗿𝗼𝗼𝗿 👑📨🌪️
├─⦿ 𝗛𝗼𝗯𝗯𝘆 : 𝗛𝗮͜͡𝟯𝗸𝗶𝗻𝗴 🎭
├─⦿ ⚡𝗪͟𝗛͟͠𝗢 𝗜͟𝗔͟͠𝗠 𝗬͟𝗢͟͠𝗨 𝗛𝗔͟𝗩𝗘 𝗡͟͠𝗢 𝗜͟𝗗͟͠𝗘𝗔 📨🍷
├─⦿ 🌪️𝗙͟𝗔͟͠𝗧𝗛𝗘𝗥 𝗢͟𝗙 𝗡͟𝗢͟͠𝗕𝗜𝗡 ⚡
├─⦿ ⁷¹³ 𝗟𝗢𝗔𝗗𝗜𝗡𝗚........................👾
├─⦿ 𝐆𝐞𝐧𝐝𝐞𝐫: ${ownerInfo.gender}
├─⦿ 𝐍𝐢𝐜𝐤: ${ownerInfo.nick}
╰────────────◊
`;

        // SEND MESSAGE WITH VIDEO
        api.sendMessage(
          {
            body: msg,
            attachment: fs.createReadStream(videoPath)
          },
          event.threadID,
          () => {
            // DELETE VIDEO AFTER SEND
            if (fs.existsSync(videoPath)) {
              fs.unlinkSync(videoPath);
            }
          },
          event.messageID
        );

        // REACTION
        if (
          event.body &&
          event.body.toLowerCase().includes("owner")
        ) {
          api.setMessageReaction(
            "🚀",
            event.messageID,
            () => {},
            true
          );
        }

      });

      // SAVE ERROR
      writer.on("error", (err) => {
        console.log(err);

        api.sendMessage(
          "❌ VIDEO SAVE ERROR",
          event.threadID
        );
      });

    } catch (error) {
      console.log(error);

      api.sendMessage(
        "❌ COMMAND ERROR",
        event.threadID
      );
    }
  }
};
