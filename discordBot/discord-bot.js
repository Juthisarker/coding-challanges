require("dotenv").config();

// Discord.js versions ^13.0 require us to explicitly define client intents
const { Client, GatewayIntentBits } = require("discord.js");
//const fetch = require("node-fetch");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    // GatewayIntentBits.GuildMembers,
  ],
});

import("node-fetch")
  .then(({ default: fetch }) => {
    // Your code using fetch here
  })
  .catch((error) => {
    console.error("Error importing node-fetch:", error);
  });

// client.on('ready', () => {
//  console.log(Logged in as ${client.user.tag}!);
// });

function getQuote() {
  return fetch("https://dummyjson.com/quotes/random")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
}

client.on("messageCreate", (msg) => {
  console.log("mdg", msg);
  if (msg.author.bot) return;
  // if (content === 'hello') {
  //    msg.reply(Hello ${msg.author.username});
  //  }
  if (msg.content === "!quote") {
    console.log("hahahah");
    getQuote().then((quote) => {
      console.log("quote");
      msg.channel.send(quote.quote);
    });
  }
});
// Log In our bot
client.login(process.env.CLIENT_TOKEN);
