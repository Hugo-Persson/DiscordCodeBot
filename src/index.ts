import Discord from "discord.js";

const client = new Discord.Client();
require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
    if (msg.content.startsWith("!")) {
        const chunks = msg.content.split(" ");
        const command = chunks.shift();
        switch (command) {
            case "!help":
                help(msg,chunks);
                break;
            case "!run":
                run(msg, chunks);
                break;
            case "!library":
                library(msg, chunks);
                break;
            default:
              msg.reply("Unknown command");
        }
        if (chunks.length) {
        } else {
            msg.reply(
                "Command need to be followed by an argument that is the code you want to execute"
            );
        }
    }
});

function help(msg: Discord.Message, chunks: Array<string>) {}
function run(msg: Discord.Message, chunks: Array<string>) {
  
}
function library(msg: Discord.Message, chunks: Array<string>) {}
function executeCodeContainer(code) {}
client.login(process.env.TOKEN);
