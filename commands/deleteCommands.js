const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { token, clientId, guildId } = require("../config.json");

const rest = new REST({ version: "10" }).setToken(token);

async function deleteAllCommands() {
  try {
    console.log("❌ 기존 슬래시 명령어 삭제 중...");

    const commands = await rest.get(
      Routes.applicationGuildCommands(clientId, guildId)
    );

    if (commands.length === 0) {
      console.log("ℹ️ 삭제할 명령어가 없습니다.");
      return;
    }

    for (const command of commands) {
      await rest.delete(
        Routes.applicationGuildCommand(clientId, guildId, command.id)
      );
      console.log(`🗑️ 삭제됨: ${command.name}`);
    }

    console.log("✅ 모든 명령어 삭제 완료!");
  } catch (error) {
    console.error("❌ 명령어 삭제 실패:", error);
  }
}

deleteAllCommands();
