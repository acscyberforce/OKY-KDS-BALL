const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
	config: {
		name: "os",
		version: "1.2",
		author: "siyam8881",
		countDown: 5,
		role: 2,
		shortDescription: "sarcasm",
		longDescription: "Responds with random media when someone says 'os'",
		category: "reply",
	},

	onStart: async function () {},

	onChat: async function ({ event, message }) {
		if (!event.body) return;

		const text = event.body.toLowerCase().trim();
		if (!text.includes("os")) return;

		const mediaLinks = [
			"https://files.catbox.moe/8066ce.mp4",
			"https://files.catbox.moe/yf3gz5.mp4",
			"https://files.catbox.moe/rhjkhg.mp4",
			"https://files.catbox.moe/rq2fzt.mp4",
			"https://files.catbox.moe/j0ifa2.mp4",
			"https://files.catbox.moe/bni2rv.mp4"
		];

		const randomLink = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];
		const fileName = `os_${Date.now()}.mp4`;
		const filePath = path.join(__dirname, fileName);

		try {
			const response = await axios({
				method: "GET",
				url: randomLink,
				responseType: "stream",
				timeout: 20000
			});

			const writer = fs.createWriteStream(filePath);

			response.data.pipe(writer);

			writer.on("finish", async () => {
				try {
					await message.reply({
						body: "-!X-z⁶²M?\n\n々𝗪͜͡𝗛𝗢 -? 🎭👑\n\n- 々𝐈𝐌𝐎𝐍 𝗩𝗜𝗥𝗨𝗦🚩🏴‍☠️📨",
						attachment: fs.createReadStream(filePath)
					});
				} catch (e) {
					console.log("Send error:", e.message);
				}

				if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
			});

			writer.on("error", (err) => {
				console.log("Write error:", err.message);
				if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
			});

		} catch (err) {
			console.log("Download error:", err.message);
			return message.reply("⚠️ Media load failed. Try again later.");
		}
	}
};
