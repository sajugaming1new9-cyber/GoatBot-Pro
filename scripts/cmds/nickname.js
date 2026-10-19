module.exports = {
  config: {
    name: "nickname",
    aliases: ["nic"],
    version: "3.0.0",
    author: "Saju",
    countDown: 10,
    role: 1,
    shortDescription: "Auto girl/boy nicknames",
    category: "box chat",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;
    const botID = api.getCurrentUserID();

    // 🎀 Girl names
    const girlNames = [
      "Ayesha", "Mim", "Nusrat", "Jannat", "Sumaiya",
      "Tanjila", "Tasnim", "Mahiya", "Sadia", "Sanjida",
      "Nabila", "Anika", "Raisa", "Riya", "Tisha",
      "Tania", "Mariya", "Maliha", "Faria", "Farzana",
      "Lamisa", "Labiba", "Nafisa", "Afra", "Afsana",
      "Arisha", "Ariya", "Samiha", "Samia", "Sohana",
      "Sanjana", "Sinthia", "Jerin", "Jui", "Puja",
      "Priya", "Oishi", "Orin", "Mousumi", "Muntaha",
      "Mahira", "Mehjabin", "Madhuri", "Rumana", "Rukaiya",
      "Rifa", "Nawar", "Naira", "Zarin", "Zara",
      "Ishrat", "Tasmia", "Trisha", "Shifa", "Safa",
      "Sabiha", "Nishi", "Nila", "Mrittika", "Brishti",
      "Chandni", "Disha", "Diya", "Esha", "Eva",
      "Fahmida", "Humaira", "Inaya", "Joya", "Keya",
      "Lamia", "Lubna", "Mou", "Nandini", "Purnima",
      "Roshni", "Sathi", "Ariana", "Mishka", "Zoya",
      "Alisha", "Arohi", "Meghla", "Anamika", "Rupali"
    ];

    // 👑 Boy names
    const boyNames = [
      "Akash", "Sajid", "Sakib", "Rakib", "Nayeem",
      "Tanvir", "Shakib", "Fahim", "Rifat", "Raihan",
      "Nabil", "Nafis", "Siam", "Sohan", "Shanto",
      "Tamim", "Tawhid", "Tanim", "Adnan", "Arian",
      "Arif", "Ashik", "Abir", "Arafat", "Ayon",
      "Badhon", "Bijoy", "Emon", "Fardin", "Farhan",
      "Foysal", "Hasan", "Hridoy", "Imran", "Ibrahim",
      "Jubayer", "Jisan", "Kawsar", "Mahim", "Mahdi",
      "Maruf", "Mehedi", "Miraj", "Mizan", "Munna",
      "Nahid", "Noman", "Omar", "Parvez", "Rashed",
      "Rasel", "Ridoy", "Rohan", "Rubel", "Sabbir",
      "Sakil", "Samir", "Shafin", "Shihab", "Sifat",
      "Sojib", "Sujon", "Tarek", "Wasim", "Yasin",
      "Zihad", "Zubair", "Anik", "Asif", "Biplob",
      "Dipto", "Fahad", "Iftekhar", "Ismail", "Jamil",
      "Khalid", "Limon", "Mamun", "Muntasir", "Nirjhor",
      "Rahat", "Riyad", "Sajjad", "Shuvo", "Touhid",
      "Uzzal", "Yamin", "Rafsan", "Abrar", "Tahmid"
    ];

    // নাম দেখে gender অনুমান করার fallback
    const girlHints = new Set(girlNames.map(n => n.toLowerCase()));
    const boyHints = new Set(boyNames.map(n => n.toLowerCase()));

    function detectGender(userInfo) {
      const gender = String(
        userInfo?.gender ?? userInfo?.sex ?? ""
      ).toLowerCase();

      if (["female", "f", "2"].includes(gender)) return "girl";
      if (["male", "m", "1"].includes(gender)) return "boy";

      const name = String(userInfo?.name || "")
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ")
        .split(/\s+/)
        .filter(Boolean);

      for (const word of name) {
        if (girlHints.has(word)) return "girl";
        if (boyHints.has(word)) return "boy";
      }

      return null;
    }

    const pickRandom = list =>
      list[Math.floor(Math.random() * list.length)];

    api.getThreadInfo(threadID, (err, info) => {
      if (err || !info?.participantIDs) {
        return api.sendMessage(
          "❌ Group member list পাওয়া যায়নি!",
          threadID,
          event.messageID
        );
      }

      const members = info.participantIDs.filter(
        id => id !== botID
      );

      if (!members.length) {
        return api.sendMessage(
          "❌ কোনো member পাওয়া যায়নি!",
          threadID,
          event.messageID
        );
      }

      api.sendMessage(
        `🖤 AUTO NICKNAME STARTED\n\n👥 Members: ${members.length}\n🎀 Girl/Boy name auto set হচ্ছে...`,
        threadID,
        event.messageID
      );

      let index = 0;
      let success = 0;
      let failed = 0;
      let skipped = 0;

      function processNext() {
        if (index >= members.length) {
          return api.sendMessage(
            `✅ NICKNAME PROCESS COMPLETE\n\n` +
            `👥 Total: ${members.length}\n` +
            `✅ Updated: ${success}\n` +
            `❌ Failed: ${failed}\n` +
            `⚪ Skipped: ${skipped}\n\n` +
            `🖤 Stylish Nickname System`,
            threadID
          );
        }

        const userID = members[index++];

        api.getUserInfo(userID, (userErr, userData) => {
          const userInfo =
            !userErr && userData
              ? (userData[userID] || userData)
              : {};

          const gender = detectGender(userInfo);

          if (!gender) {
            skipped++;
            return setTimeout(processNext, 250);
          }

          const nickname = pickRandom(
            gender === "girl" ? girlNames : boyNames
          );

          api.changeNickname(
            nickname,
            threadID,
            userID,
            changeErr => {
              if (changeErr) failed++;
              else success++;

              setTimeout(processNext, 650);
            }
          );
        });
      }

      processNext();
    });
  }
};
