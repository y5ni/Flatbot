const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const User = require('./models/User');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected ✅'))
.catch(err => console.log(err));

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

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

  const randomXP = Math.floor(Math.random() * 10) + 5;
  user.xp += randomXP;

  const neededXP = user.level * 100;

  if (user.xp >= neededXP) {
    user.level += 1;
    user.xp = 0;

    message.channel.send(
      `🎉 | ${message.author} وصل لفل ${user.level}!`
    );
  }

  await user.save();

  if (message.content === '!rank') {
    message.reply(
      `لفلك: ${user.level} | XP: ${user.xp}/${neededXP}`
    );
  }

  if (message.content === '!ping') {
    message.reply('pong 🏓');
  }
});

client.login(process.env.TOKEN);
