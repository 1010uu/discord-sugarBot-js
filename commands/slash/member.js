const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { newMemberId, regularMemberId } = require("../../config.json");
const { callApi } = require("../../utils/api.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("멤버")
    .setDescription("서버 멤버 관련 명령어")
    .addSubcommand((sub) =>
      sub.setName("리스트").setDescription("서버의 모든 멤버를 출력합니다.")
    )
    .addSubcommand((sub) =>
      sub
        .setName("업데이트")
        .setDescription("서버의 멤버 리스트를 업데이트 합니다.")
    ),

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "리스트") {
      await handleListCommand(interaction);
    } else if (subcommand === "업데이트") {
      await handleUpdateCommand(interaction);
    }
  },
};

async function handleListCommand(interaction) {
  await interaction.deferReply();

  try {
    const guild = interaction.guild;
    await guild.members.fetch();

    const newMembers = guild.members.cache
      .filter(
        (member) => !member.user.bot && member.roles.cache.has(newMemberId)
      )
      .map((member) => `${member.nickname}`)
      .join("\n");

    const regularMembers = guild.members.cache
      .filter(
        (member) => !member.user.bot && member.roles.cache.has(regularMemberId)
      )
      .map((member) => `${member.nickname}`)
      .join("\n");

    const message = `**💛옵빠들💛 서버 멤버 리스트:**\n\`\`\`
1. 🌳 나무\n${regularMembers}
2. 🌱 새싹\n${newMembers}
\`\`\``;

    await interaction.editReply(message);
  } catch (error) {
    console.error("❌ 멤버 정보 가져오기 실패:", error);
    await interaction.editReply("❌ 멤버 정보를 불러오는 중 오류 발생");
  }
}

async function handleUpdateCommand(interaction) {
  const { guild, member } = interaction;

  if (!guild) {
    return interaction.reply({
      content: "❌ 서버에서만 사용 가능한 명령어입니다.",
      ephemeral: true,
    });
  }

  //권한 체크 (ADMINISTRATOR 역할 필요)
  if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    return interaction.reply({
      content: "❌ 이 명령어를 실행할 권한이 없습니다.",
      ephemeral: true, // 응답을 명령어 실행자만 볼 수 있도록 설정
    });
  }

  await interaction.deferReply();

  try {
    await guild.members.fetch();

    const members = guild.members.cache
      .filter(
        (member) =>
          !member.user.bot &&
          (member.roles.cache.has(newMemberId) ||
            member.roles.cache.has(regularMemberId))
      )
      .map((member) => ({
        memberId: member.user.id,
        nickname: member.nickname
          ? member.nickname.split("/")[0]
          : member.user.username,
      }));

    const apiResponse = await callApi("memberUpdate", members);

    await interaction.editReply(
      apiResponse
        ? "✅ 멤버 정보 업데이트 완료!"
        : "❌ 멤버 정보 업데이트 실패!"
    );
  } catch (error) {
    console.error("❌ 멤버 업데이트 중 오류 발생:", error);
    await interaction.editReply("❌ 멤버 업데이트 중 오류 발생!");
  }
}
