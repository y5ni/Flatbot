const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const channel = client.channels.cache.get('1492605081797923027');

  if (!channel) return;

  joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator
  });

  console.log('دخلت الفويس تلقائي 🎧');
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Ping
  if (message.content.toLowerCase() === '!ping') {
    return message.reply('pong 🏓');
  }

  // Join Voice
  if (message.content.toLowerCase() === '!join') {

    if (!message.member.voice.channel) {
      return message.reply('ادخل روم فويس أول 😭');
    }

    joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    return message.reply('🎧.');
  }

  // Leave Voice
  if (message.content.toLowerCase() === '!leave') {

    const connection = getVoiceConnection(message.guild.id);

    if (!connection) {
      return message.reply('أنا مو بالفويس 😭');
    }

    connection.destroy();

    return message.reply('😔🤘🏻.');
  }
});

client.login(process.env.TOKEN);
