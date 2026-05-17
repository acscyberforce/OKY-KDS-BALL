const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "os",
		version: "3.0",
		author: "IMON",
		countDown: 5,
		role: 0,
		shortDescription: "Stylish Auto Reply",
		longDescription: "Reply with random stylish video when someone says os",
		category: "reply",
		guide: "Type os"
	},

	onStart: async function () {},

	onChat: async function ({ event, message }) {
		try {

			// CHECK MESSAGE
			if (!event.body || typeof event.body !== "string") return;

			const text = event.body.toLowerCase().trim();

			// TRIGGER WORD
			if (!text.includes("os")) return;

			// RANDOM VIDEOS
			const videos = [
				"https://files.catbox.moe/8066ce.mp4",
				"https://files.catbox.moe/yf3gz5.mp4",
				"https://files.catbox.moe/rhjkhg.mp4",
				"https://files.catbox.moe/rq2fzt.mp4",
				"https://files.catbox.moe/j0ifa2.mp4",
				"https://files.catbox.moe/bni2rv.mp4"
			];

			// RANDOM PICK
			const randomVideo =
				videos[Math.floor(Math.random() * videos.length)];

			// TMP FOLDER
			const tempDir = path.join(__dirname, "tmp");

			// CREATE TMP
			if (!fs.existsSync(tempDir)) {
				fs.mkdirSync(tempDir, { recursive: true });
			}

			// FILE PATH
			const filePath = path.join(
				tempDir,
				`os_${Date.now()}.mp4`
			);

			// DOWNLOAD VIDEO
			const response = await axios({
				url: randomVideo,
				method: "GET",
				responseType: "stream",
				timeout: 30000
			});

			// SAVE FILE
			const writer = fs.createWriteStream(filePath);

			response.data.pipe(writer);

			writer.on("finish", async () => {
				try {

					// STYLISH MESSAGE
					const msg = `
╭━━━〔 ⚠️ 𝗢𝗦 𝗗𝗘𝗧𝗘𝗖𝗧𝗘𝗗 ⚠️ 〕━━━╮

┃ 🧠 𝗦𝘆𝘀𝘁𝗲𝗺 : 𝗔𝗰𝘁𝗶𝘃𝗲
┃ 👑 𝗢𝘄𝗻𝗲𝗿 : 々𝐈𝐌𝐎𝐍 𝗩𝗜𝗥𝗨𝗦
┃ 🚩 𝗦𝘁𝗮𝘁𝘂𝘀 : 𝗥𝘂𝗻𝗻𝗶𝗻𝗴
┃ ⚡ 𝗣𝗼𝘄𝗲𝗿 : 𝗨𝗻𝗹𝗶𝗺𝗶𝘁𝗲𝗱
┃ 🎭 𝗠𝗼𝗼𝗱 : 𝗦𝗮𝘃𝗮𝗴𝗲

╰━━━〔 🏴‍☠️ 𝗧𝗜𝗚𝗘𝗥 𝗜𝗠𝗢𝗡 🏴‍☠️ 〕━━━╯
`;

					// SEND REPLY
					await message.reply({
						body: msg,
						attachment: fs.createReadStream(filePath)
					});

					// DELETE FILE
					setTimeout(() => {
						if (fs.existsSync(filePath)) {
							fs.unlinkSync(filePath);
						}
					}, 5000);

				} catch (sendErr) {
					console.log("Send Error:", sendErr);

					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath);
					}
				}
			});

			// WRITE ERROR
			writer.on("error", (err) => {
				console.log("Write Error:", err);

				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			});

		} catch (err) {
			console.log("Main Error:", err);

			return message.reply(
				"⚠️ 𝗠𝗲𝗱𝗶𝗮 𝗟𝗼𝗮𝗱 𝗙𝗮𝗶𝗹𝗲𝗱..."
			);
		}
	}
};
