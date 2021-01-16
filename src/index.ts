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
        * $run {code} - Will run the code, you can run code inside code blocks
        * $saveScript {code} - Will start saving a script, you will be asked for name, you have following flags available -p --public -sg --severGlobal
        * $library will display available scripts you have stored
        * $serverScripts
        * $subscribe {id}
    `);
}

function run(msg: Discord.Message, chunks: Array<string>) {
    executeCodeContainer(parseCodeInput(chunks.join(" ")), msg);
}

function parseCodeInput(code: string): string {
    let codeStartIndex = code.search("```");
    if (codeStartIndex === -1) codeStartIndex = 0;
    let codeEnd = code.lastIndexOf("```");
    if (codeEnd === -1) codeEnd = undefined;
    else codeEnd -= 1;
    let filteredCode = code.substr(codeStartIndex, codeEnd);
    let lineBreak = filteredCode.search("\n");

    if (lineBreak !== -1) filteredCode = filteredCode.substr(lineBreak);
    return filteredCode;
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
    console.log("CODE", code);
    try {
        const result = safeEval(code, { console: { log: fakeConsoleLog } });
        msg.reply("\n" + returnMessages.join("\n"));
    } catch (e: any) {
        msg.reply("Error " + e.message);
    }
}
client.login(process.env.TOKEN);
