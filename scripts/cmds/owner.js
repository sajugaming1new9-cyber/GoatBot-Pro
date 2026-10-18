const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports = {
  config: {
    name: "owner",
    version: "1.3.0",
    author: "Mᴏʜᴀᴍᴍᴀᴅ Aᴋᴀsʜ",
    role: 0,
    shortDescription: "Owner information with image",
    category: "Information",
    guide: {
      en: "owner"
    }
  },

  onStart: async function ({ api, event }) {
    const ownerText = 
`╚━━━━━━━━━━━𓆩🎧𓆪━━━━━━━━━━━╝

 ░▒▓█ 𝐎𝐖𝐍𝐄𝐑 𝐏𝐑𝐎𝐅𝐈𝐋𝐄 █▓▒░

╭━━━『 👑 𝐏𝐄𝐑𝐒𝐎𝐍𝐀𝐋 』━━━╮
┃
┃ 🥷 𝐍𝐀𝐌𝐄     ➤ 𓆩 𝐒𝐚𝐣𝐮 𝐈𝐬𝐥𝐚𝐦 𓆪
┃ 🧸 𝐍𝐈𝐂𝐊     ➤ 𝐒ᴀᴊᴜ
┃ 🎂 𝐀𝐆𝐄      ➤ 𝟏𝟖+
┃ 🥀 𝐒𝐓𝐀𝐓𝐔𝐒   ➤ 𝐒𝐈𝐍𝐆𝐋𝐄
┃ 💼 𝐖𝐎𝐑𝐊     ➤ 𝐉𝐎𝐁 𝐇𝐎𝐋𝐃𝐄𝐑
┃ 📚 𝐄𝐃𝐔      ➤ 𝐍𝐎𝐓 𝐒𝐏𝐄𝐂𝐈𝐅𝐈𝐄𝐃
┃ 🌍 𝐋𝐎𝐂𝐀𝐓𝐈𝐎𝐍 ➤ 𝐃𝐇𝐀𝐊𝐀 🇧🇩
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

╭━━━『 🔗 𝐂𝐎𝐍𝐍𝐄𝐂𝐓 𝐖𝐈𝐓𝐇 𝐌𝐄 』━━━╮
┃
┃ 📘 𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊
┃ https://www.facebook.com/share/19F2j9DmsA/
┃
┃ 💚 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏
┃ https://wa.me/8801863098227
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`;

    const cacheDir = path.join(__dirname, "cache");
    const imgPath = path.join(cacheDir, "owner.jpg");

    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

    const imgLink = "https://i.imgur.com/1G4ZhU7.jpeg";

    const send = () => {
      api.sendMessage(
        {
          body: ownerText,
          attachment: fs.createReadStream(imgPath)
        },
        event.threadID,
        () => fs.unlinkSync(imgPath),
        event.messageID
      );
    };

    request(encodeURI(imgLink))
      .pipe(fs.createWriteStream(imgPath))
      .on("close", send);
  }
};
