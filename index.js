client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.guild) return;

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

  if (message.content.toLowerCase() === '!rank') {
    return message.reply(
      `لفلك: ${user.level} | XP: ${user.xp}/${neededXP}`
    );
  }

  if (message.content.toLowerCase() === '!ping') {
    return message.reply('pong 🏓');
  }
});
