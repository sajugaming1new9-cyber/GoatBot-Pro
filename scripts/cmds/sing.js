
const axios = require("axios");
const yts = require("yt-search");
const fs = require("fs");
const path = require("path");

const CACHE_DIR = path.join(__dirname, "cache");

// Song download API
const SONG_API = "https://eryxenx.agi.bd/api/song";

const STYLE = {
    search: (name) =>
`╭━━━『 🎀 𝐇𝐈𝐍𝐀𝐓𝐀 𝐌𝐔𝐒𝐈𝐂 🎀 』━━━╮
┃
┃  🌸 𝐇𝐞𝐲 𝐁𝐚𝐛𝐲! 𝐒𝐨𝐧𝐠 𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠...
┃  💗 𝐒𝐨𝐧𝐠: ${name}
┃
╰━━━━━━━━━━━━━━━━━━━━╯
     ♡ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡... 🐰`,

    downloading: (name) =>
`╭━━━『 🎧 𝐌𝐔𝐒𝐈𝐂 𝐓𝐈𝐌𝐄 🎧 』━━━╮
┃
┃  💕 𝐓𝐢𝐭𝐥𝐞: ${name}
┃  🌷 𝐒𝐭𝐚𝐭𝐮𝐬: Downloading...
┃
╰━━━━━━━━━━━━━━━━━━━━╯
     💖 𝑀𝑎𝑑𝑒 𝑤𝑖𝑡ℎ 𝑙𝑜𝑣𝑒 ♡`,

    success: (name, duration) =>
`╭━━━『 🎀 𝐇𝐈𝐍𝐀𝐓𝐀 𝐌𝐔𝐒𝐈𝐂 🎀 』━━━╮
┃
┃  🎵 𝐒𝐨𝐧𝐠: ${name}
┃  ⏱️ 𝐓𝐢𝐦𝐞: ${duration}
┃  💗 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞!
┃
╰━━━━━━━━━━━━━━━━━━━━╯
   🌸 𝐄𝐧𝐣𝐨𝐲 𝐘𝐨𝐮𝐫 𝐌𝐮𝐬𝐢𝐜 🌸
        𝑊𝑖𝑡ℎ 𝑙𝑜𝑣𝑒 ♡`,

    notFound:
`╭━━━『 🥺 𝐒𝐎𝐑𝐑𝐘! 』━━━╮
┃
┃  💔 𝐍𝐨 𝐒𝐨𝐧𝐠 𝐅𝐨𝐮𝐧𝐝!
┃  🌷 Try another song name.
┃
╰━━━━━━━━━━━━━━━━╯`,

    error:
`╭━━━『 😿 𝐎𝐎𝐏𝐒! 』━━━╮
┃
┃  💔 𝐒𝐨𝐧𝐠 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐅𝐚𝐢𝐥𝐞𝐝!
┃  🌸 Please try again later.
┃
╰━━━━━━━━━━━━━━━━╯`
};

module.exports.config = {
    name: "song",
    aliases: [],
    version: "2.0.0",
    author: "Saju",
    countDown: 5,
    role: 0,
    shortDescription: "Download songs 🎵",
    longDescription: "Search and send songs with cute Hinata-style replies",
    category: "media",
    guide: {
        en: "{pn} <song name>\nExample: {pn} Believer"
    }
};

async function getDownloadInfo(videoUrl) {
    const response = await axios.get(SONG_API, {
        params: { url: videoUrl },
        timeout: 60000
    });

    const data = response.data;

    if (!data || !data.success || !data.downloadUrl) {
        throw new Error("Download API did not return a valid link");
    }

    return data;
}

async function downloadFile(url, filePath) {
    const response = await axios.get(url, {
        responseType: "stream",
        timeout: 300000
    });

    await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on("finish", resolve);
        writer.on("error", reject);
        response.data.on("error", reject);
    });

    const stats = fs.statSync(filePath);

    if (stats.size < 1024) {
        throw new Error("Downloaded audio file is empty or invalid");
    }
}

module.exports.onStart = async function ({
    args,
    message
}) {
    const query = args.join(" ").trim();

    if (!query) {
        return message.reply(
`╭━━━『 🎀 𝐇𝐈𝐍𝐀𝐓𝐀 𝐌𝐔𝐒𝐈𝐂 🎀 』━━━╮
┃
┃  🥺 Baby, song name dao!
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
        );
    }

    let filePath;

    try {
        await message.reply(STYLE.search(query));

        const results = await yts(query);
        const video = results.videos && results.videos[0];

        if (!video) {
            return message.reply(STYLE.notFound);
        }

        await message.reply(STYLE.downloading(video.title));

        const info = await getDownloadInfo(video.url);

        fs.mkdirSync(CACHE_DIR, { recursive: true });

        filePath = path.join(
            CACHE_DIR,
            `song_${Date.now()}.mp3`
        );

        await downloadFile(info.downloadUrl, filePath);

        await message.reply({
            body: STYLE.success(
                info.title || video.title,
                video.timestamp || "Unknown"
            ),
            attachment: fs.createReadStream(filePath)
        });

    } catch (error) {
        console.error("[SONG COMMAND ERROR]", error);

        await message.reply(STYLE.error);

    } finally {
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (error) {
                console.error("Could not delete temporary file:", error.message);
            }
        }
    }
};
