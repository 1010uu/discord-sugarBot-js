module.exports = (client) => {
  const responses = {
    이리: "지금 바로 시작해",
    뽕히는: "뽕히는 밥오",
    히주니는: "히주니는 밥오",
    윰미는: "윰미는 천재",
    뽕히: "바보",
    히주니: "바보",
    윰미: "천재",
    윰메: "초초천재",
  };

  client.on("messageCreate", (message) => {
    if (message.author.bot) return; // 봇 메시지는 무시

    for (const key in responses) {
      if (message.content.includes(key)) {
        message.reply(responses[key]);
        break;
      }
    }
  });
};
