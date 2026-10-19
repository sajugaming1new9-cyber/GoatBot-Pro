
module.exports.config = {
  name: "rf",
  aliases: ["rf"],
  version: "1.0.0",
  author: "Saju",
  countDown: 10,
  role: 0,
  shortDescription: "GC Refresh Emoji Style",
  longDescription: "Send stylish emoji lines in group chat",
  category: "fun",
  guide: {
    en: "{pn}"
  }
};

module.exports.onStart = async function ({ message }) {
  const lines = [
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🥀 🖤 ➖ 🥀 🖤 ➖ 🥀 🖤",
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖",
    "➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🖤 🥀 ➖ 🖤 🥀 ➖ 🖤 🥀",
    "🥀 ➖ 🖤 🥀 ➖ 🖤 🥀 ➖",
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🥀 🖤 ➖ 🥀 🖤 ➖ 🥀 🖤",
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖",
    "➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🖤 🥀 ➖ 🖤 🥀 ➖ 🖤 🥀",
    "🥀 ➖ 🖤 🥀 ➖ 🖤 🥀 ➖",
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🥀 🖤 ➖ 🥀 🖤 ➖ 🥀 🖤",
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖",
    "➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🖤 🥀 ➖ 🖤 🥀 ➖ 🖤 🥀",
    "🥀 ➖ 🖤 🥀 ➖ 🖤 🥀 ➖",
    "🖤 ➖ 🥀 🖤 ➖ 🥀 🖤 ➖ 🥀",
    "🥀 🖤 ➖ 🥀 🖤 ➖ 🥀 🖤"
  ];

  const body = [
    "╭━━━『 🖤 𝐆𝐂 𝐑𝐄𝐅𝐑𝐄𝐒𝐇 🖤 』━━━╮",
    "",
    ...lines,
    "",
    "╰━━━━━━━ 🥀 ➖ 🖤 ━━━━━━━╯"
  ].join("\n");

  return message.reply(body);
};
