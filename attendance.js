const { attendanceCheck } = require("./config.json");
const { callApi } = require("./utils/api.js");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    // 메시지가 출석 체크 채널에서 왔는지 확인
    if (message.channel.id !== attendanceCheck) return;

    if (message.author.id === "218010938807287808") {
      // 마냥봇 메시지 감지
      console.log(
        `봇 이름: ${message.author.username}, 봇 ID: ${message.author.id}`
      );

      // 출석 순위 확인
      if (message.embeds[0].title.includes("순위")) {
        console.log(`메세지 제목: ${message.embeds[0].data.title}`);
        const description = message.embeds[0].data.description;
        const descriptionData = description.split("\n").slice(1).join("\n");

        const regex =
          /\*\*(\d+)\.\*\*\s`([^`]+)\/([^`]+)#(\d+)` → (\d+)회 \(Lv\.(\d+)\) - `([^`]+)`/g;

        let match;
        const users = [];

        while ((match = regex.exec(descriptionData)) !== null) {
          const nickname = match[2]; // 닉네임
          const userId = match[3] + "#" + match[4]; // 아이디
          const count = match[5]; // 횟수
          users.push({ nickname, userId, count });
        }

        // API 호출
        const apiResponse = await callApi("attendanceRank", users);

        if (apiResponse) {
          const rankings = apiResponse.result.rankings;
          let rankingMessage = "😍이번 회차 출석 순위:\n";

          rankings.forEach((user) => {
            rankingMessage += `${user.ranking}등: ${user.nickname}🤍 - ${user.realCount}회\n`;
          });
          await message.reply(rankingMessage);
        } else {
          await message.reply("❌ 출석 순위 정보 업데이트 실패!");
        }
      }
    }
  });
};
