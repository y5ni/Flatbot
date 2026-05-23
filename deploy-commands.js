require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('يرد البوت بكلمة pong'),

  new SlashCommandBuilder()
    .setName('join')
    .setDescription('يدخل البوت للفويس'),

  new SlashCommandBuilder()
    .setName('leave')
    .setDescription('يطلع البوت من الفويس')

].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {

    console.log('بدأ تسجيل الأوامر ✨');

    await rest.put(
      Routes.applicationCommands('1507138616114155520'),
      { body: commands }
    );

    console.log('تم تسجيل أوامر السلاش 😼');

  } catch (error) {
    console.error(error);
  }
})();
