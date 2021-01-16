import Discord from "discord.js";
import safeEval from "safe-eval";

const client = new Discord.Client();
require("dotenv").config();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}$`);
});

client.on("message", (msg) => {
    if (msg.content.startsWith("$")) {
        const chunks = msg.content.split(" ");
        const command = chunks.shift();
        switch (command) {
            case "$help":
                help(msg, chunks);
                break;
            case "$run":
                run(msg, chunks);
                break;
            case "$runLine":
                runLine(msg, chunks);
                break;
            case "$library":
                library(msg, chunks);
                break;
            default:
                msg.reply("Unknown command");
        }
    }
});

function help(msg: Discord.Message, chunks: Array<string>) {
    msg.reply(`
        You have following commands available 
        * $help - Will display all available commands
        * $runLine {code} - Will run a line of code without formatting
        * $run {code} - Will run formatted code inside code block
        * $saveScript {code} - Will start saving a script, you will be asked for name, you have following flags available -p --public -sg --severGlobal
        * $library will display available scripts you have stored
        * $serverScripts
        * $subscribe {id}
    `);
}
function runLine(msg: Discord.Message, chunks: Array<string>) {
    if (chunks.length) {
        const code = chunks[0];
        executeCodeContainer(code, msg);
    } else {
        msg.reply("No arguments sent, please use syntax $runLine {code}");
    }
}

function run(msg: Discord.Message, chunks: Array<string>) {
    const concattedString: string = chunks.join(" ");
    const codeStartIndex = concattedString.search("```");
    let filteredCode = concattedString.substr(
        codeStartIndex,
        concattedString.lastIndexOf("```") - 1
    );

    filteredCode = filteredCode.substr(filteredCode.search("\n"));

    executeCodeContainer(filteredCode, msg);
}
function library(msg: Discord.Message, chunks: Array<string>) {}
function executeCodeContainer(code: string, msg: Discord.Message) {
    const returnMessages: Array<any> = [];
    const fakeConsoleLog = (message: any) => {
        returnMessages.push(message);
    };
    code = `
    (()=>{
        ${code}
    })();
    `;
    try {
        const result = safeEval(code, { console: { log: fakeConsoleLog } });
        msg.reply("\n" + returnMessages.join("\n"));
    } catch (e: any) {
        msg.reply("Error " + e.message);
    }
}
client.login(process.env.TOKEN);
