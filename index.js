const {
  Client,
  GatewayIntentBits,
  ActivityType
} = require('discord.js');

const {
  joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');

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

  // Status
  client.user.setPresence({
    activities: [
      {
        name: 'nightly 💢',
        type: ActivityType.Watching
      }
    ],
    status: 'online'
  });

  try {

    // Auto Join Voice
    const channel = await client.channels.fetch('1492605081797923027');

    if (!channel) {
      console.log('ما لقيت الروم الصوتي 💔');
      return;
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator
    });

    console.log('دخلت الفويس تلقائي 🎧');

  } catch (error) {
    console.log(error);
  }

});

client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // /ping
  if (interaction.commandName === 'ping') {
    return interaction.reply('pong 🏓');
  }

  // /join
  if (interaction.commandName === 'join') {

    if (!interaction.member.voice.channel) {
      return interaction.reply({
        content: 'ادخل روم فويس أول 😭',
        ephemeral: true
      });
    }

    joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    return interaction.reply('🎧');
  }

  // /leave
  if (interaction.commandName === 'leave') {

    const connection = getVoiceConnection(interaction.guild.id);

    if (!connection) {
      return interaction.reply({
        content: 'أنا مو بالفويس 😭',
        ephemeral: true
      });
    }

    connection.destroy();

    return interaction.reply('😔🤘🏻');
  }

});

client.login(process.env.TOKEN);
