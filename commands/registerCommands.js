const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { token, clientId, guildId } = require("../config.json");
const fs = require("fs");
const path = require("path");

const rest = new REST({ version: "10" }).setToken(token);

async function registerCommands() {
  try {
    console.log("슬래시 명령어 등록 중...");

    // commands/slash 폴더의 모든 명령어 파일 읽기
    const commands = [];
    const commandFiles = fs
      .readdirSync(path.join(__dirname, "slash"))
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`./slash/${file}`);
      if (command.data) commands.push(command.data.toJSON());
    }

    // 현재 등록된 명령어 목록 확인
    const currentCommands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );

    // 등록된 명령어 이름이 중복되지 않도록 필터링
    const existingCommandNames = currentCommands.map((cmd) => cmd.name);

    const uniqueCommands = commands.filter(
      (command) => !existingCommandNames.includes(command.name)
    );

    if (uniqueCommands.length === 0) {
      console.log(
        "이미 등록된 명령어 이름과 겹치는 명령어가 없어 새로운 명령어를 등록하지 않습니다."
      );
      return;
    }

    // 명령어 등록
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: uniqueCommands,
    });

    console.log("✅ 슬래시 명령어 등록 완료!");
  } catch (error) {
    console.error("❌ 명령어 등록 실패:", error);
  }
}

module.exports = registerCommands;
