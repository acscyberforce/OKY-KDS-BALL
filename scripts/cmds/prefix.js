const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports = {
	config: {
		name: "prefix",
		version: "4.0",
		author: "IMON",
		countDown: 5,
		role: 0,
		shortDescription: "Stylish Prefix System",
		longDescription: "Change bot prefix with stylish video reply",
		category: "config",
		guide: {
			en:
				"{pn} <new prefix>\nExample: {pn} !\n\n{pn} <new prefix> -g\nExample: {pn} ! -g\n\n{pn} reset"
		}
	},

	langs: {
		en: {
			reset: "✅ Prefix reset successfully",
			onlyAdmin: "⚠️ Only bot admin can change global prefix",
			confirmGlobal: "⚡ React this message to confirm GLOBAL prefix change",
			confirmThread: "⚡ React this message to confirm GROUP prefix change"
		}
	},

	// START COMMAND
	onStart: async function ({
		message,
		role,
		args,
		commandName,
		event,
		threadsData,
		getLang
	}) {

		try {

			// CHECK PREFIX INPUT
			if (!args[0]) {
				return message.reply(
					"⚠️ Please enter a new prefix"
				);
			}

			// RESET PREFIX
			if (args[0].toLowerCase() === "reset") {

				await threadsData.set(
					event.threadID,
					null,
					"data.prefix"
				);

				return message.reply(
					`${getLang("reset")} ➜ ${global.GoatBot.config.prefix}`
				);
			}

			// NEW PREFIX
			const newPrefix = args[0];

			// REACTION DATA
			const formSet = {
				commandName,
				author: event.senderID,
				newPrefix,
				setGlobal: false
			};

			// GLOBAL PREFIX
			if (args[1] === "-g") {

				if (role < 2) {
					return message.reply(
						getLang("onlyAdmin")
					);
				}

				formSet.setGlobal = true;
			}

			// CONFIRM MESSAGE
			return message.reply(
				formSet.setGlobal
					? getLang("confirmGlobal")
					: getLang("confirmThread"),

				(err, info) => {

					if (err) return;

					formSet.messageID = info.messageID;

					global.GoatBot.onReaction.set(
						info.messageID,
						formSet
					);
				}
			);

		} catch (err) {

			console.log("PREFIX START ERROR:", err);

			return message.reply(
				"❌ Prefix command error"
			);
		}
	},

	// REACTION SYSTEM
	onReaction: async function ({
		message,
		threadsData,
		event,
		Reaction
	}) {

		try {

			const {
				author,
				newPrefix,
				setGlobal
			} = Reaction;

			// SECURITY CHECK
			if (event.userID !== author) return;

			// VIDEO URL
			const videoUrl =
				"https://i.imgur.com/szfIKa3.mp4";

			// TMP FOLDER
			const tempDir = path.join(
				__dirname,
				"tmp"
			);

			// CREATE TMP
			if (!fs.existsSync(tempDir)) {
				fs.mkdirSync(tempDir, {
					recursive: true
				});
			}

			// FILE PATH
			const filePath = path.join(
				tempDir,
				`prefix_${Date.now()}.mp4`
			);

			// DOWNLOAD VIDEO
			const response = await axios({
				url: videoUrl,
				method: "GET",
				responseType: "stream",
				timeout: 30000
			});

			// SAVE VIDEO
			const writer =
				fs.createWriteStream(filePath);

			response.data.pipe(writer);

			// DOWNLOAD FINISH
			writer.on("finish", async () => {

				try {

					// GLOBAL PREFIX
					if (setGlobal) {

						global.GoatBot.config.prefix =
							newPrefix;

						fs.writeFileSync(
							global.client.dirConfig,
							JSON.stringify(
								global.GoatBot.config,
								null,
								2
							)
						);

						await message.reply({
							body: `
╭━━━〔 🌐 GLOBAL PREFIX 🌐 〕━━━╮

┃ ✅ PREFIX UPDATED
┃ ⚡ NEW PREFIX: ${newPrefix}
┃ 👑 STATUS: SUCCESS
┃ 🚀 SYSTEM: ONLINE
┃ 🏴‍☠️ OWNER: TIGER IMON

╰━━━〔 ⚡ SYSTEM ACTIVE ⚡ 〕━━━╯
`,
							attachment:
								fs.createReadStream(
									filePath
								)
						});

					} else {

						// THREAD PREFIX
						await threadsData.set(
							event.threadID,
							newPrefix,
							"data.prefix"
						);

						await message.reply({
							body: `
╭━━━〔 💬 GROUP PREFIX 💬 〕━━━╮

┃ ✅ PREFIX UPDATED
┃ ⚡ NEW PREFIX: ${newPrefix}
┃ 👑 STATUS: SUCCESS
┃ 🚀 GROUP ACTIVE
┃ 🏴‍☠️ OWNER: TIGER IMON

╰━━━〔 ⚡ SYSTEM ACTIVE ⚡ 〕━━━╯
`,
							attachment:
								fs.createReadStream(
									filePath
								)
						});
					}

					// DELETE VIDEO
					setTimeout(() => {

						try {

							if (
								fs.existsSync(
									filePath
								)
							) {
								fs.unlinkSync(
									filePath
								);
							}

						} catch (e) {
							console.log(
								"DELETE ERROR:",
								e
							);
						}

					}, 5000);

				} catch (err) {

					console.log(
						"SEND MESSAGE ERROR:",
						err
					);

					if (fs.existsSync(filePath)) {
						fs.unlinkSync(filePath);
					}
				}
			});

			// WRITE ERROR
			writer.on("error", (err) => {

				console.log(
					"VIDEO WRITE ERROR:",
					err
				);

				if (fs.existsSync(filePath)) {
					fs.unlinkSync(filePath);
				}
			});

		} catch (err) {

			console.log(
				"REACTION ERROR:",
				err
			);

			return message.reply(
				"❌ Reaction system error"
			);
		}
	},

	// PREFIX CHECK
	onChat: async function ({
		event,
		message,
		usersData
	}) {

		try {

			if (
				event.body &&
				event.body.toLowerCase() ===
					"prefix"
			) {

				// USER NAME
				const name =
					await usersData.getName(
						event.senderID
					);

				// PREFIX
				const threadPrefix =
					global.utils.getPrefix(
						event.threadID
					);

				// REPLY
				return message.reply(`
╭━━━〔 ⚡ BOT PREFIX ⚡ 〕━━━╮

┃ 👤 USER: ${name}
┃ 🌐 GLOBAL: ${global.GoatBot.config.prefix}
┃ 💬 GROUP: ${threadPrefix}
┃ 🚀 STATUS: ONLINE
┃ 🏴‍☠️ OWNER: TIGER IMON

╰━━━〔 👾 SYSTEM ACTIVE 👾 〕━━━╯
`);
			}

		} catch (err) {

			console.log(
				"ONCHAT ERROR:",
				err
			);
		}
	}
};
