const express = require('express');
const Discord = require('discord.js');
const mongoose = require('mongoose');

const app = express();
const port = 8000;

// Koneksi ke MongoDB
mongoose.connect('mongodb+srv://zyx24:24774212@cluster0.i70woq4.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Skema MongoDB
const playerPointsSchema = new mongoose.Schema({
  User: String,
  Points: Number
});
const PlayerPoints = mongoose.model('PlayerPoints', playerPointsSchema);

// Inisialisasi bot Discord
const bot = new Discord.Client({
    allowedMentions: {
        parse: [
            'users',
            'roles'
        ],
        repliedUser: true
    },
    autoReconnect: true,
    disabledEvents: [
        "TYPING_START"
    ],
    partials: [
        Discord.Partials.Channel,
        Discord.Partials.GuildMember,
        Discord.Partials.Message,
        Discord.Partials.Reaction,
        Discord.Partials.User,
        Discord.Partials.GuildScheduledEvent
    ],
    intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildBans,
        Discord.GatewayIntentBits.GuildEmojisAndStickers,
        Discord.GatewayIntentBits.GuildIntegrations,
        Discord.GatewayIntentBits.GuildWebhooks,
        Discord.GatewayIntentBits.GuildInvites,
        Discord.GatewayIntentBits.GuildVoiceStates,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMessageTyping,
        Discord.GatewayIntentBits.DirectMessages,
        Discord.GatewayIntentBits.DirectMessageReactions,
        Discord.GatewayIntentBits.DirectMessageTyping,
        Discord.GatewayIntentBits.GuildScheduledEvents,
        Discord.GatewayIntentBits.MessageContent
    ],
    restTimeOffset: 0
});
const token = 'MTA1MjUxMDc4MDAxODQwMTM3MQ.GQUJvd.M0R2CL4CrgLTMdPMYVMsNB2nUS_odUmwnUCuIs';

bot.on('ready', () => {
  console.log('Bot Discord siap!');
});

app.use(express.json());

app.post('/send-playerpoints', (req, res) => {
  const playerName = req.body.playerName;
  const points = req.body.points;

  // Kirim pesan ke channel Discord dengan ID tertentu
  const channelId = '1054956068142329917';
  const channel = bot.channels.cache.get(channelId);
  if (channel && channel.isText()) {
    channel.send(`playerpoints give ${playerName} ${points}`)
      .then(() => {
        console.log(`PlayerPoints berhasil dikirim ke ${playerName} di Discord`);
        // Simpan data di MongoDB
        const playerPoints = new PlayerPoints({
          User: playerName,
          Points: points
        });
        playerPoints.save((err) => {
          if (err) {
            console.error(`Gagal menyimpan data PlayerPoints ke MongoDB: ${err}`);
            return res.status(500).send('Internal Server Error');
          }
          return res.sendStatus(200);
        });
      })
      .catch((error) => {
        console.error(`Gagal mengirimkan pesan ke Discord: ${error}`);
        return res.status(500).send('Internal Server Error');
      });
  } else {
    console.error(`Channel dengan ID ${channelId} tidak ditemukan atau bukan channel teks`);
    return res.status(500).send('Internal Server Error');
  }
});

bot.login(token)
  .then(() => {
    console.log('Bot Discord berhasil login');
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(`Gagal login ke Discord: ${error}`);
  });
