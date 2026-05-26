require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('pong'),

  new SlashCommandBuilder()
    .setName('join')
    .setDescription('دخول الفويس'),

  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('الخروج من الفويس'),

  new SlashCommandBuilder()
    .setName('rank')
    .setDescription('عرض لفلك')

].map(command => command.toJSON());

const rest = new REST({ version: '10' })
.setToken(process.env.TOKEN);

(async () => {

  try {

    console.log('بدأ تسجيل أوامر السلاش...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('تم تسجيل أوامر السلاش ✅');

  } catch (error) {
    console.error(error);
  }

})();
