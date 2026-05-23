const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // أمر Ping
  if (message.content.toLowerCase() === '!ping') {
    return message.reply('pong 🏓');
  }

  // أمر دخول الفويس
  if (message.content.toLowerCase() === '!join') {

    if (!message.member.voice.channel) {
      return message.reply('ادخل روم فويس أول 😭');
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    return message.reply('دخلت الفويس 😼🎧');
  }
});

client.login(process.env.TOKEN);
