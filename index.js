const {
  Client,
  GatewayIntentBits
} = require('discord.js');

const {
  joinVoiceChannel,
  getVoiceConnection
} = require('@discordjs/voice');

const mongoose = require('mongoose');

const User = require('./models/User');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.log(err));

client.once('ready', async () => {

  console.log(`Logged in as ${client.user.tag}`);

  // Status
  client.user.setActivity('nightly 💢', {
    type: 3
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

// نظام XP
client.on('messageCreate', async message => {

  if (message.author.bot) return;

  let user = await User.findOne({
    userId: message.author.id,
    guildId: message.guild.id
  });

  if (!user) {

    user = new User({
      userId: message.author.id,
      guildId: message.guild.id,
      xp: 0,
      level: 1
    });

  }

  // زيادة XP
  user.xp += 10;

  // حساب اللفل المطلوب
  const neededXP = user.level * 100;

  // لفل أب
  if (user.xp >= neededXP) {

    user.level += 1;
    user.xp = 0;

    message.channel.send(
      `🎉 | ${message.author} لفلت إلى مستوى ${user.level}!`
    );

  }

  await user.save();

});

// Slash Commands
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
