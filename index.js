const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
const { token } = require("./config.json");
const fs = require("fs");
const path = require("path");

// 클라이언트 생성
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// 명령어 등록
const registerCommands = require("./commands/registerCommands");
client.commands = new Collection();

// commands/slash 폴더에서 명령어 불러오기
const commandFiles = fs
  .readdirSync(path.join(__dirname, "commands/slash"))
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/slash/${file}`);
  client.commands.set(command.data.name, command);
}

// 봇이 준비되었을 때 실행
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  registerCommands();
});

// 슬래시 명령어 처리
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error("❌ 명령어 실행 오류:", error);
    await interaction.reply({
      content: "❌ 명령어 실행 중 오류가 발생했습니다.",
      ephemeral: true,
    });
  }
});

//✅ 출석 관련 모듈 추가
const registerAttendance = require("./attendance");
registerAttendance(client);

//✅ 핑퐁 기능 모듈 추가
const registerPingPong = require("./pingpong");
registerPingPong(client);

// 5. 시크릿키(토큰)을 통해 봇 로그인 실행
client.login(token);
