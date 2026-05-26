require('dotenv').config();

const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' })
.setToken(process.env.TOKEN);

(async () => {

  try {

    console.log('جاري حذف كل أوامر السلاش...');

    // حذف أوامر GLOBAL
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: [] }
    );

    // حذف أوامر السيرفر
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        '1492204029118386423'
      ),
      { body: [] }
    );

    console.log('تم حذف كل الأوامر ✅');

  } catch (error) {
    console.error(error);
  }

})();
