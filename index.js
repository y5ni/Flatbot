const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (message.content === '!ping') {
    message.reply('pong 🏓');
  }
});

client.login(process.env.MTUwNzEzODYxNjExNDE1NTUyMA.GHpnLW.sgp4JouCD5FYkRaaL9rjJZmFReS2Bsu1Bh9op8);
