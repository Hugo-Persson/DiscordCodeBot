import Discord from "discord.js";



const client = new Discord.Client();
require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith("!runCode")) {
    const chunks = msg.content.split(" ");
    chunks.shift();
    if(chunks.length){

    }
    else{
      msg.reply("Command need to be followed by an argument that is the code you want to execute");
    }
  }
});


function executeCodeContainer(code){

}
client.login(process.env.TOKEN);