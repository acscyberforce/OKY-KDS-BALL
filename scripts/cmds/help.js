const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "help",
		aliases: ["menu", "commands"],
		version: "4.8",
		author: "IMON",
		shortDescription: "Show all available commands",
		longDescription: "Displays a clean and premium-styled categorized list of commands.",
		category: "system",
		guide: "{pn}help [command name]"
	},

	onStart: async function ({ message, args, prefix }) {
		const allCommands = global.GoatBot.commands;
		const categories = {};

		const emojiMap = {
			ai: "➥", "ai-image": "➥", group: "➥", system: "➥",
			fun: "➥", owner: "➥", config: "➥", economy: "➥",
			media: "➥", "18+": "➥", tools: "➥", utility: "➥",
			info: "➥", image: "➥", game: "➥", admin: "➥",
			rank: "➥", boxchat: "➥", others: "➥"
		};

		const cleanCategoryName = (text) => {
			if (!text) return "others";
			return text
				.normalize("NFKD")
				.replace(/[^\w\s-]/g, "")
				.replace(/\s+/g, " ")
				.trim()
				.toLowerCase();
		};

		const ownerName = `
╔════════════════════╗
      『 BOT OWNER 』
         ✦ IMON ✦
╚════════════════════╝
`;

		for (const [, command] of allCommands) {
			const category = cleanCategoryName(command.config.category);
			if (!categories[category]) categories[category] = [];
			categories[category].push(command.config.name);
		}

		let msg = `${ownerName}\n`;

		for (const category in categories) {
			msg += `╭──『 ${category.toUpperCase()} 』\n`;

			categories[category].sort().forEach(cmd => {
				msg += `│ ${emojiMap[category] || "➥"} ${prefix}${cmd}\n`;
			});

			msg += `╰────────────────\n\n`;
		}

		msg += `✨ Total Commands: ${allCommands.size}\n`;
		msg += `⚡ Powered By IMON`;

		return message.reply(msg);
	}
};
