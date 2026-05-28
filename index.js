const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
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

// READY
client.once('ready', async () => {

  console.log(`Logged in as ${client.user.tag}`);

  // STATUS
  client.user.setActivity('nightly 💢', {
    type: 3
  });

  try {

    // AUTO VOICE JOIN
    const channel = await client.channels.fetch('1492605081797923027');

    if (!channel) {
      console.log('ما لقيت روم الفويس 💔');
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

// XP SYSTEM
client.on('messageCreate', async message => {

  try {

    if (message.author.bot) return;
    if (!message.guild) return;

    let user = await User.findOne({
      userId: message.author.id,
      guildId: message.guild.id
    });

    // NEW USER
    if (!user) {

      user = new User({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: 0,
        level: 1
      });

    }

    // ADD XP
    user.xp += 10;

    // XP REQUIRED
    const neededXP = user.level * 100;

    // LEVEL UP
    if (user.xp >= neededXP) {

      user.level += 1;
      user.xp = 0;

      const levelEmbed = new EmbedBuilder()
      .setColor('#000000')
      .setDescription(`
<a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895> <a:010_sparks:1496589360869412895>

- 𝑲𝒆𝒆𝒑 𝒈𝒐𝒊𝒏𝒈 𝒒𝒖𝒆𝒆𝒏 <a:1431350405111222426:1508979875686645760>

- 𝑵𝒆𝒘 𝒍𝒗𝒍 <a:0_arrowright:1496580935460847807> : **${user.level}**
`)
      .setImage('https://cdn.discordapp.com/attachments/1475666807103815814/1508976137420669028/f3ffd67d81c167de3eaa34e45d9555b6.gif?ex=6a177f0a&is=6a162d8a&hm=52efe9e4280d6b9eb692621bf7435e3dccb4e658e5e12fa201f2750c387a6d01&')
      .setThumbnail(
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp();

      // LEVEL CHANNEL
      const levelChannel = message.guild.channels.cache.get('1504878473058189472');

      if (levelChannel) {

        levelChannel.send({
          content: `<@${message.author.id}>`,
          embeds: [levelEmbed],
          allowedMentions: {
            users: [message.author.id]
          }
        });

      }

      console.log(`${message.author.tag} لفّل إلى ${user.level}`);

    }

    await user.save();

  } catch (error) {
    console.log(error);
  }

});

// SLASH COMMANDS
client.on('interactionCreate', async interaction => {

  if (!interaction.isChatInputCommand()) return;

  // /PING
  if (interaction.commandName === 'ping') {

    return interaction.reply('pong 🏓');

  }

  // /JOIN
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

  // /LEAVE
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

  // /RANK
  if (interaction.commandName === 'rank') {

    let user = await User.findOne({
      userId: interaction.user.id,
      guildId: interaction.guild.id
    });

    if (!user) {

      return interaction.reply({
        content: 'ماعندك XP للحين 😭',
        ephemeral: true
      });

    }

    const neededXP = user.level * 100;

    return interaction.reply(
      `🔥 لفلك: ${user.level}\n✨ XP: ${user.xp}/${neededXP}`
    );

  }

});

client.login(process.env.TOKEN);
