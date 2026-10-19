
const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");
const VIDEO_API = "https://eryxenx.agi.bd/api/video";

const ALBUMS = {
  1:  { name: "Anime Edit 🌸", query: "anime edit AMV" },
  2:  { name: "Anime Fight ⚔️", query: "anime fight scene" },
  3:  { name: "Romantic Anime 💕", query: "romantic anime edit" },
  4:  { name: "Sad Anime 🥀", query: "sad anime edit" },
  5:  { name: "Bike Edit 🏍️", query: "sport bike cinematic edit" },
  6:  { name: "Superbike 🔥", query: "superbike cinematic" },
  7:  { name: "Car Edit 🚘", query: "supercar cinematic edit" },
  8:  { name: "Luxury Cars 💎", query: "luxury car cinematic" },
  9:  { name: "Nature 🌿", query: "beautiful nature cinematic" },
  10: { name: "Rain Aesthetic 🌧️", query: "rain aesthetic video" },
  11: { name: "Love Status 💗", query: "romantic love status video" },
  12: { name: "Sad Status 💔", query: "sad status video" },
  13: { name: "Funny Clips 😂", query: "funny clean clips" },
  14: { name: "Football ⚽", query: "football skills edit" },
  15: { name: "Cricket 🏏", query: "cricket best moments" },
  16: { name: "Gaming 🎮", query: "gaming montage edit" },
  17: { name: "Travel 🌍", query: "travel cinematic video" },
  18: { name: "Sky & Moon 🌙", query: "moon sky aesthetic video" },
  19: { name: "Motivation 👑", query: "motivational cinematic video" },
  20: { name: "Dance 💃", query: "dance performance video" }
};

const STYLE = {
  menu: () => `╭━━━『 🎀 𝐇𝐈𝐍𝐀𝐓𝐀 𝐀𝐋𝐁𝐔𝐌 🎀 』━━━╮
│
│  🌸 Choose Your Favourite Video
│  💌 Reply with a number
│
${Object.entries(ALBUMS)
  .map(([number, item]) => `│ ${number}. ${item.name}`)
  .join("\n")}
│
╰━━━━━━━━━━━━━━━━━━━━╯
     💗 𝑀𝑎𝑑𝑒 𝑤𝑖𝑡ℎ 𝑙𝑜𝑣𝑒 ♡`,

  loading: name => `╭━━━『 🎬 𝐀𝐋𝐁𝐔𝐌 🎬 』━━━╮
│ 🌸 Category: ${name}
│ 💗 Searching your video...
╰━━━━━━━━━━━━━━━━━━━━╯`,

  error: `╭━━━『 🥺 𝐎𝐎𝐏𝐒! 』━━━╮
│ 💔 Video download failed.
│ 🌷 Please try again later.
╰━━━━━━━━━━━━━━━━━━━━╯`
};

async function getDownloadInfo(videoUrl) {
  const response = await axios.get(VIDEO_API, {
    params: { url: videoUrl },
    timeout: 60000
  });

  const data = response.data;

  if (!data?.success || !data?.downloadUrl) {
    throw new Error("Video download link not found");
  }

  return data;
}

async function downloadVideo(url, destination) {
  const response = await axios.get(url, {
    responseType: "stream",
    timeout: 300000,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });

  const writer = fs.createWriteStream(destination);

  await new Promise((resolve, reject) => {
    response.data.on("error", reject);
    writer.on("error", reject);
    writer.on("finish", resolve);
    response.data.pipe(writer);
  });

  if (fs.statSync(destination).size < 1024) {
    throw new Error("Invalid or empty video file");
  }
}

async function sendVideo({ message, selection }) {
  const album = ALBUMS[selection];

  if (!album) {
    return message.reply(
      "🥺 Valid number dao! 1 theke 20 porjonto.\n🎀 Type album to open the menu."
    );
  }

  let filePath;

  try {
    await message.reply(STYLE.loading(album.name));

    const results = await yts(album.query);
    const video = results.videos?.find(item => item.url);

    if (!video) {
      return message.reply("🥀 Sorry! Ei category-te video paini.");
    }

    const info = await getDownloadInfo(video.url);

    fs.mkdirSync(CACHE_DIR, { recursive: true });

    filePath = path.join(
      CACHE_DIR,
      `album_${Date.now()}.mp4`
    );

    await downloadVideo(info.downloadUrl, filePath);

    await message.reply({
      body: `╭━━━『 🎀 𝐕𝐈𝐃𝐄𝐎 𝐑𝐄𝐀𝐃𝐘 🎀 』━━━╮
│
│ 🎬 ${info.title || video.title}
│ 🌸 Category: ${album.name}
│ ⏱️ Duration: ${video.timestamp || "Unknown"}
│
╰━━━━━━━━━━━━━━━━━━━━╯
    💗 𝐄𝐧𝐣𝐨𝐲 𝐘𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 ♡`,
      attachment: fs.createReadStream(filePath)
    });

  } catch (error) {
    console.error("[ALBUM ERROR]", error);
    await message.reply(STYLE.error);

  } finally {
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (_) {}
    }
  }
}

module.exports = {
  config: {
    name: "album",
    aliases: ["videos", "videomenu"],
    version: "1.0.0",
    author: "Saju",
    countDown: 5,
    role: 0,
    shortDescription: "Cute video album 🎀",
    longDescription: "Search and send videos from 20 categories",
    category: "media",
    guide: {
      en: "{pn} — open menu, then reply with a number from 1 to 20"
    }
  },

  onStart: async function ({ message, event }) {
    const sent = await message.reply(STYLE.menu());

    if (sent?.messageID && global.GoatBot?.onReply) {
      global.GoatBot.onReply.set(sent.messageID, {
        commandName: "album",
        type: "albumMenu",
        author: event.senderID
      });
    }
  },

  onReply: async function ({ message, event, Reply }) {
    if (!Reply || Reply.type !== "albumMenu") return;

    if (
      Reply.author &&
      String(event.senderID) !== String(Reply.author)
    ) {
      return message.reply(
        "💗 Ei menu-ta je open koreche, shei person reply koruk. 🌸"
      );
    }

    const selection = String(event.body || "")
      .trim()
      .split(/\s+/)[0];

    await sendVideo({ message, selection });
  }
};
